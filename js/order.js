import { CART_KEY, ORDER_KEY, readJson, writeJson } from './storage.js';
import { showToast } from './toast.js';

document.addEventListener('DOMContentLoaded', () => {
  const order = readJson(ORDER_KEY, null);
  const idEl = document.querySelector('#order-id');
  const statusEl = document.querySelector('#order-status');
  const progressEl = document.querySelector('.status-progress');
  const steps = document.querySelectorAll('.status-step');
  const orderItemsEl = document.querySelector('#order-items');
  const messageEl = document.querySelector('.order-message');
  const cancelBtn = document.querySelector('#cancel-order');
  const readyNoteEl = document.querySelector('.ready-note');

  if (!order) {
    if (idEl) idEl.textContent = 'No Active Order';
    if (statusEl) statusEl.textContent = 'Browse the menu to start a fresh batch.';
    if (orderItemsEl) {
      orderItemsEl.innerHTML = `
        <div style="text-align:center;padding:24px 0;">
          <p style="color:var(--muted);margin-bottom:16px;">No recent order found in your browser cache.</p>
          <a class="button button-primary" href="menu.html">Browse Artisan Menu &rarr;</a>
        </div>
      `;
    }
    return;
  }

  // Populate Order ID
  if (idEl) idEl.textContent = order.id;

  const states = [
    { title: 'Order received', desc: 'Your ticket has arrived at our bakehouse counter.' },
    { title: 'Payment confirmed', desc: 'Transaction verified and sent to master bakers.' },
    { title: 'Preparing your order', desc: 'Measuring flour, whisking farm eggs & French butter.' },
    { title: 'Baking in deck ovens', desc: 'Golden crusts rising at 220°C in our stone deck ovens.' },
    { title: order.fulfillment === 'pickup' ? 'Ready for counter pickup!' : 'Out for express delivery!', desc: order.fulfillment === 'pickup' ? 'Your warm box is waiting at our counter in Boeung Tumpun.' : 'Our courier is on the way with your freshly boxed treats.' }
  ];

  let currentStep = Math.min(order.step || 2, states.length - 1);

  function renderTracker() {
    if (statusEl) statusEl.textContent = states[currentStep].title;
    
    // Set vertical progress bar height percentage
    if (progressEl) {
      const pct = (currentStep / (states.length - 1)) * 100;
      progressEl.style.setProperty('--progress', `${pct}%`);
      progressEl.style.height = `${pct}%`;
    }

    steps.forEach((stepItem, idx) => {
      const isPast = idx < currentStep;
      const isCurrent = idx === currentStep;
      stepItem.classList.toggle('is-complete', isPast);
      stepItem.classList.toggle('is-current', isCurrent);

      // Add checkmark for past steps
      const span = stepItem.querySelector('span');
      if (span) {
        if (isPast) {
          span.innerHTML = '&#10003;';
        } else {
          span.textContent = `0${idx + 1}`;
        }
      }
    });

    if (messageEl) {
      messageEl.innerHTML = `<span class="live-pulse"></span> <em>${states[currentStep].desc}</em>`;
    }

    // Dynamic ready note
    if (readyNoteEl) {
      if (currentStep >= states.length - 1) {
        readyNoteEl.innerHTML = `
          <strong>✨ Ready Now!</strong>
          <span>${order.fulfillment === 'pickup' ? 'Please present Order ID #' + order.id + ' at the counter.' : 'Courier is arriving at your delivery location.'}</span>
        `;
      } else {
        const remainingMinutes = Math.max(5, 30 - currentStep * 7);
        readyNoteEl.innerHTML = `
          <span>Estimated time remaining</span>
          <strong>~${remainingMinutes} minutes</strong>
          <small style="display:block;margin-top:4px;color:var(--muted);">Fulfillment: ${order.fulfillment === 'pickup' ? 'Bakery Counter Pickup' : 'Express Phnom Penh Delivery'}</small>
        `;
      }
    }
  }

  renderTracker();

  // Populate Itemized Receipt
  if (orderItemsEl && Array.isArray(order.items)) {
    const customer = order.customer || {};
    orderItemsEl.innerHTML = `
      <div class="order-receipt-card">
        <div class="receipt-header-row">
          <div>
            <strong>Recipient:</strong> ${customer.name || 'Valued Guest'}<br>
            <small style="color:var(--muted);">${customer.phone || ''} • ${customer.email || ''}</small>
          </div>
          <div style="text-align:right;">
            <strong>Method:</strong> ${order.fulfillment === 'pickup' ? 'Pickup' : 'Delivery'}<br>
            <small style="color:var(--muted);">Payment: ${customer.payment || 'Cash'}</small>
          </div>
        </div>
        ${customer.address ? `<p class="receipt-address"><strong>Address / Note:</strong> ${customer.address}</p>` : ''}
        <hr style="border:0;border-top:1px solid var(--line);margin:12px 0;">
        <div class="receipt-items-list">
          ${order.items.map(item => `
            <div class="receipt-item-row">
              <span>${item.name} <strong>&times; ${item.quantity}</strong></span>
              <span>$${(item.price * item.quantity).toFixed(2)}</span>
            </div>
          `).join('')}
        </div>
        <hr style="border:0;border-top:1px solid var(--line);margin:12px 0;">
        <div class="receipt-totals-box">
          <div class="receipt-row"><span>Subtotal</span><span>$${Number(order.subtotal || 0).toFixed(2)}</span></div>
          <div class="receipt-row"><span>Delivery Fee</span><span>${order.deliveryFee === 0 ? 'FREE' : '$' + Number(order.deliveryFee).toFixed(2)}</span></div>
          ${order.discount > 0 ? `<div class="receipt-row" style="color:var(--teal);"><span>Promo Discount</span><span>-$${Number(order.discount).toFixed(2)}</span></div>` : ''}
          <div class="receipt-row receipt-grand-total"><span>Total Paid / Due</span><strong>$${Number(order.total || 0).toFixed(2)}</strong></div>
        </div>
      </div>
    `;
  }

  // Cancel Order Handler
  if (cancelBtn) {
    cancelBtn.addEventListener('click', () => {
      if (confirm('Are you sure you want to cancel this order?')) {
        writeJson(ORDER_KEY, { ...order, step: -1, cancelled: true });
        cancelBtn.disabled = true;
        cancelBtn.textContent = 'Order Cancelled';
        cancelBtn.style.opacity = '0.6';
        if (messageEl) {
          messageEl.innerHTML = '<span style="color:var(--coral);font-weight:bold;">✖ Your order was cancelled. We hope to bake for you another day!</span>';
        }
        if (readyNoteEl) {
          readyNoteEl.innerHTML = '<strong>Cancelled</strong><span>This order will not be baked or delivered.</span>';
        }
        showToast('Your order has been cancelled', 'info');
      }
    });
  }

  // Order Again Button Handler
  const orderAgainBtn = document.querySelector('.order-actions a');
  if (orderAgainBtn) {
    orderAgainBtn.addEventListener('click', (e) => {
      if (order.items && order.items.length > 0) {
        writeJson(CART_KEY, order.items);
        document.dispatchEvent(new CustomEvent('cakery-cart-change'));
        showToast('Items re-added to your cart!', 'success');
      }
    });
  }

  // Auto-advance tracker stages every 8 seconds for an engaging live simulation
  const advanceTimer = window.setInterval(() => {
    if (currentStep < states.length - 1) {
      currentStep += 1;
      order.step = currentStep;
      writeJson(ORDER_KEY, order);
      renderTracker();
      showToast(`Kitchen update: ${states[currentStep].title}`, 'info');
    } else {
      clearInterval(advanceTimer);
    }
  }, 8000);
});
