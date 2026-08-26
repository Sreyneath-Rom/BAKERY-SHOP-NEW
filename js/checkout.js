import { CART_KEY, ORDER_KEY, readJson, writeJson } from './storage.js';
import { cartTotal, getCart, removeItem } from './cart.js';
import { showToast } from './toast.js';

document.addEventListener('DOMContentLoaded', () => {
  const summaryEl = document.querySelector('#checkout-summary');
  const totalEl = document.querySelector('#checkout-total');
  const subtotalEl = document.querySelector('#checkout-subtotal');
  const deliveryFeeEl = document.querySelector('#checkout-delivery-fee');
  const tipRowEl = document.querySelector('#checkout-tip-row');
  const tipValEl = document.querySelector('#checkout-tip-val');
  const discountRowEl = document.querySelector('#checkout-discount-row');
  const discountValEl = document.querySelector('#checkout-discount-val');
  const form = document.querySelector('#checkout-form');
  const loadingEl = document.querySelector('.checkout-loading');

  let discountPercent = 0;
  let fixedDiscount = 0;
  let freeShipping = false;
  let appliedPromoCode = '';
  let selectedTip = 0;

  // Render initial checkout summary
  function renderCheckoutSummary() {
    const currentCart = getCart();
    if (!summaryEl) return;

    if (currentCart.length === 0) {
      summaryEl.innerHTML = `
        <div class="empty-checkout-notice">
          <p>🥐 Your basket is currently empty.</p>
          <a class="button button-primary" href="menu.html">Browse Artisan Menu &rarr;</a>
        </div>
      `;
      if (totalEl) totalEl.textContent = '$0.00';
      if (subtotalEl) subtotalEl.textContent = '$0.00';
      const submitBtn = form?.querySelector('button[type="submit"]');
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.style.opacity = '0.5';
      }
      return;
    }

    summaryEl.innerHTML = currentCart.map((item, idx) => {
      const imgSrc = item.image.startsWith('http') ? item.image : (item.image.startsWith('/') ? item.image : '../' + item.image.replace(/^\.\//, ''));
      return `
        <div class="checkout-line" data-index="${idx}">
          <div class="checkout-line-left">
            <img class="checkout-thumb" src="${imgSrc}" alt="${item.name}" onerror="this.src='../images/logo.png'">
            <div>
              <span class="checkout-item-name">${item.name}</span>
              <span class="checkout-item-qty">${item.quantity} × $${Number(item.price).toFixed(2)}</span>
            </div>
          </div>
          <div class="checkout-line-right">
            <strong>$${(item.price * item.quantity).toFixed(2)}</strong>
            <button type="button" class="checkout-remove-btn" data-index="${idx}" title="Remove item">&#10005;</button>
          </div>
        </div>
      `;
    }).join('');

    updateTotals();
  }

  function getFulfillmentType() {
    const checked = document.querySelector('input[name="fulfillment"]:checked');
    return checked ? checked.value : 'delivery';
  }

  function updateTotals() {
    const currentCart = getCart();
    if (currentCart.length === 0) return;

    const subtotal = cartTotal(currentCart);
    const fulfillment = getFulfillmentType();
    let deliveryFee = fulfillment === 'pickup' ? 0.00 : (freeShipping ? 0.00 : 3.00);
    
    let discountAmount = 0;
    if (discountPercent > 0) {
      discountAmount += subtotal * (discountPercent / 100);
    }
    if (fixedDiscount > 0) {
      discountAmount += fixedDiscount;
    }
    discountAmount = Math.min(subtotal, discountAmount);

    const finalTotal = Math.max(0, subtotal + deliveryFee + selectedTip - discountAmount);

    if (subtotalEl) subtotalEl.textContent = `$${subtotal.toFixed(2)}`;
    if (deliveryFeeEl) deliveryFeeEl.textContent = deliveryFee === 0 ? 'FREE' : `$${deliveryFee.toFixed(2)}`;

    // Tip Row
    if (tipRowEl && tipValEl) {
      if (selectedTip > 0) {
        tipRowEl.style.display = 'flex';
        tipValEl.textContent = `+$${selectedTip.toFixed(2)}`;
      } else {
        tipRowEl.style.display = 'none';
      }
    }

    // Discount Row
    if (discountRowEl && discountValEl) {
      if (discountAmount > 0) {
        discountRowEl.style.display = 'flex';
        discountValEl.textContent = `-$${discountAmount.toFixed(2)} (${appliedPromoCode})`;
      } else {
        discountRowEl.style.display = 'none';
      }
    }

    if (totalEl) {
      totalEl.textContent = `$${finalTotal.toFixed(2)}`;
    }
  }

  // Tip Buttons Selection
  const tipButtons = document.querySelectorAll('.tip-pill');
  tipButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      tipButtons.forEach(b => b.classList.remove('is-active'));
      btn.classList.add('is-active');
      selectedTip = parseFloat(btn.getAttribute('data-tip') || '0');
      updateTotals();
      if (selectedTip > 0) {
        showToast(`Thank you for the $${selectedTip.toFixed(2)} baker tip! 🥐`, 'info');
      }
    });
  });

  // Promo Code Application
  const promoInput = document.querySelector('#promo-input');
  const promoApplyBtn = document.querySelector('#apply-promo-btn');
  const promoMessage = document.querySelector('#promo-message');
  const promoChips = document.querySelectorAll('.promo-chip');

  function applyPromo(code) {
    const cleanCode = code.trim().toUpperCase();
    if (!cleanCode) return;

    if (cleanCode === 'SWEET10' || cleanCode === 'CAKERY10') {
      discountPercent = 10;
      fixedDiscount = 0;
      appliedPromoCode = cleanCode;
      updateTotals();
      if (promoMessage) {
        promoMessage.innerHTML = `<span style="color:var(--teal);font-weight:700;">✨ Promo ${cleanCode} applied: 10% discount!</span>`;
      }
      showToast('🎉 10% discount applied!', 'success');
    } else if (cleanCode === 'FREESHIP') {
      freeShipping = true;
      appliedPromoCode = cleanCode;
      updateTotals();
      if (promoMessage) {
        promoMessage.innerHTML = `<span style="color:var(--teal);font-weight:700;">✨ Promo FREESHIP applied: Free Express Delivery!</span>`;
      }
      showToast('🛵 Free delivery applied!', 'success');
    } else if (cleanCode === 'CHARM5') {
      discountPercent = 0;
      fixedDiscount = 5.00;
      appliedPromoCode = cleanCode;
      updateTotals();
      if (promoMessage) {
        promoMessage.innerHTML = `<span style="color:var(--teal);font-weight:700;">✨ Promo CHARM5 applied: $5.00 off!</span>`;
      }
      showToast('🎉 $5 off coupon applied!', 'success');
    } else {
      if (promoMessage) {
        promoMessage.innerHTML = `<span style="color:var(--coral);font-weight:700;">Invalid code. Try SWEET10 or FREESHIP</span>`;
      }
      showToast('Invalid promo coupon', 'info');
    }
  }

  promoApplyBtn?.addEventListener('click', () => {
    if (promoInput) applyPromo(promoInput.value);
  });

  promoChips.forEach(chip => {
    chip.addEventListener('click', () => {
      const code = chip.getAttribute('data-code');
      if (promoInput) promoInput.value = code;
      applyPromo(code);
    });
  });

  // Handle item removal from checkout summary
  summaryEl?.addEventListener('click', (e) => {
    const removeBtn = e.target.closest('.checkout-remove-btn');
    if (!removeBtn) return;
    const idx = Number(removeBtn.dataset.index);
    const currentCart = getCart();
    const itemName = currentCart[idx]?.name || 'item';
    removeItem(idx);
    renderCheckoutSummary();
    showToast(`Removed ${itemName} from basket`, 'info');
  });

  // Fulfillment radio listener
  document.querySelectorAll('input[name="fulfillment"]').forEach((radio) => {
    radio.addEventListener('change', () => {
      const val = radio.value;
      const addrGroup = document.querySelector('#address-field-group');
      const addrInput = document.querySelector('#checkout-address');
      const addrLabel = document.querySelector('label[for="checkout-address"]');
      if (val === 'pickup') {
        if (addrLabel) addrLabel.textContent = 'Counter Pickup Note & Estimated Time (Optional)';
        if (addrInput) {
          addrInput.placeholder = 'e.g. Arriving around 11:30 AM to collect warm bread.';
          addrInput.required = false;
        }
      } else {
        if (addrLabel) addrLabel.textContent = 'Delivery Street Address / Sangkat / Notes';
        if (addrInput) {
          addrInput.placeholder = 'e.g. St 371, House 24B, near PNC Campus, Phnom Penh';
          addrInput.required = true;
        }
      }
      updateTotals();
    });
  });

  // Multi-step progress visual feedback
  const stepItems = document.querySelectorAll('.checkout-steps li');
  function updateSteps() {
    const nameVal = document.querySelector('#checkout-name')?.value.trim();
    const phoneVal = document.querySelector('#checkout-phone')?.value.trim();
    const emailVal = document.querySelector('#checkout-email')?.value.trim();
    const addrVal = document.querySelector('#checkout-address')?.value.trim();

    if (stepItems.length >= 4) {
      stepItems[0].classList.add('is-complete');
      stepItems[1].classList.toggle('is-complete', !!(nameVal && phoneVal && emailVal));
      stepItems[2].classList.toggle('is-complete', !!(addrVal || getFulfillmentType() === 'pickup'));
    }
  }

  form?.querySelectorAll('input, textarea').forEach(el => {
    el.addEventListener('input', updateSteps);
  });

  // Checkout Form Submission
  form?.addEventListener('submit', (event) => {
    event.preventDefault();
    const currentCart = getCart();
    if (!currentCart.length) {
      showToast('Your basket is empty. Please select an item from the menu.', 'info');
      return;
    }

    const submitBtn = form.querySelector('button[type="submit"]');
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.innerHTML = `<span>Checking morning ovens &amp; booking...</span>`;
    }
    if (loadingEl) {
      loadingEl.textContent = 'Preparing fresh bake ticket...';
    }

    const formData = new FormData(form);
    const customer = Object.fromEntries(formData);
    const fulfillment = getFulfillmentType();
    const deliveryFee = fulfillment === 'pickup' ? 0.00 : (freeShipping ? 0.00 : 3.00);
    const subtotal = cartTotal(currentCart);
    
    let discountAmount = 0;
    if (discountPercent > 0) discountAmount += subtotal * (discountPercent / 100);
    if (fixedDiscount > 0) discountAmount += fixedDiscount;
    discountAmount = Math.min(subtotal, discountAmount);

    const finalTotal = Math.max(0, subtotal + deliveryFee + selectedTip - discountAmount);
    const orderId = `CC-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-${Math.floor(1000 + Math.random() * 9000)}`;

    const orderPayload = {
      id: orderId,
      createdAt: new Date().toISOString(),
      step: 0,
      customer,
      fulfillment,
      payment: customer.payment || 'cash',
      items: currentCart,
      subtotal,
      deliveryFee,
      tip: selectedTip,
      discount: discountAmount,
      promoCode: appliedPromoCode || null,
      total: finalTotal
    };

    writeJson(ORDER_KEY, orderPayload);
    localStorage.removeItem(CART_KEY);
    document.dispatchEvent(new CustomEvent('cakery-cart-change'));

    showToast('Order received! Transferring to live kitchen tracker...', 'success');

    window.setTimeout(() => {
      window.location.href = `order.html?id=${orderId}`;
    }, 700);
  });

  renderCheckoutSummary();
  updateSteps();
});
