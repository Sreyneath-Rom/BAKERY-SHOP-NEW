import { showToast } from './toast.js';
import { addItem } from './cart.js';

document.addEventListener('DOMContentLoaded', () => {
  // 1. Tab Switching (Custom Cake Studio vs Express Delivery)
  const modeTabs = document.querySelectorAll('.order-mode-tab');
  const panelCustomCake = document.querySelector('#panel-custom-cake');
  const panelExpressDelivery = document.querySelector('#panel-express-delivery');

  modeTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      modeTabs.forEach(t => {
        t.classList.remove('is-active');
        t.setAttribute('aria-selected', 'false');
      });
      tab.classList.add('is-active');
      tab.setAttribute('aria-selected', 'true');

      const mode = tab.getAttribute('data-mode');
      if (mode === 'custom-cake') {
        panelCustomCake?.classList.remove('is-hidden');
        panelExpressDelivery?.classList.add('is-hidden');
      } else {
        panelCustomCake?.classList.add('is-hidden');
        panelExpressDelivery?.classList.remove('is-hidden');
      }
    });
  });

  // 2. Interactive Custom Cake Quote Calculation
  const cakeForm = document.querySelector('#cake-builder-form');
  const liveQuoteEl = document.querySelector('#live-quote-price');
  const addCakeCartBtn = document.querySelector('#add-custom-cake-cart-btn');

  function calculateCustomCakePrice() {
    if (!cakeForm) return 28.00;

    const sizeInput = cakeForm.querySelector('input[name="cake_size"]:checked');
    const basePrice = sizeInput ? parseFloat(sizeInput.getAttribute('data-base-price') || '28') : 28;

    const flavorSelect = cakeForm.querySelector('#cake-flavor');
    const selectedOption = flavorSelect?.options[flavorSelect.selectedIndex];
    const flavorExtra = selectedOption ? parseFloat(selectedOption.getAttribute('data-extra') || '0') : 0;

    let addonsExtra = 0;
    const addonCheckboxes = cakeForm.querySelectorAll('input[name="addons"]:checked');
    addonCheckboxes.forEach(cb => {
      addonsExtra += parseFloat(cb.getAttribute('data-addon-price') || '0');
    });

    const total = basePrice + flavorExtra + addonsExtra;
    if (liveQuoteEl) {
      liveQuoteEl.textContent = `$${total.toFixed(2)}`;
    }
    return total;
  }

  if (cakeForm) {
    cakeForm.addEventListener('change', calculateCustomCakePrice);
    calculateCustomCakePrice();

    // Submit Custom Cake Order
    cakeForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const customerName = document.querySelector('#cake-customer-name')?.value.trim();
      const customerPhone = document.querySelector('#cake-customer-phone')?.value.trim();
      const sizeInput = cakeForm.querySelector('input[name="cake_size"]:checked');
      const sizeText = sizeInput ? sizeInput.closest('.cake-option-card')?.querySelector('strong')?.textContent : 'Custom Cake';
      const flavorSelect = cakeForm.querySelector('#cake-flavor');
      const flavorText = flavorSelect?.options[flavorSelect.selectedIndex]?.text || '';
      const customText = document.querySelector('#cake-custom-text')?.value.trim();
      const price = calculateCustomCakePrice();

      if (!customerName || !customerPhone) {
        showToast('Please provide your name and phone number', 'info');
        return;
      }

      const submitBtn = cakeForm.querySelector('#submit-custom-cake-btn');
      const originalText = submitBtn.innerHTML;
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<span>Booking consultation...</span>';

      setTimeout(() => {
        const orderRef = `CK-STUDIO-${Math.floor(1000 + Math.random() * 9000)}`;
        const mainCard = document.querySelector('#contact-main-card');

        if (mainCard) {
          mainCard.innerHTML = `
            <div class="delivery-success-card" style="text-align:center;padding:30px 10px;">
              <div style="width:64px;height:64px;background:var(--teal);color:#fff;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:28px;margin:0 auto 16px;box-shadow:0 6px 20px rgba(31,95,88,0.3);">&#10003;</div>
              <span class="eyebrow" style="color:var(--coral);font-weight:800;">CUSTOM ORDER RESERVED</span>
              <h2 style="font-size:30px;margin:8px 0 12px;">Thank you, ${customerName}!</h2>
              <p style="color:var(--muted);font-size:14.5px;max-width:480px;margin:0 auto 20px;line-height:1.65;">
                We have registered your custom order for <strong>${sizeText}</strong> (${flavorText}). Our master cake decorator will call <strong>${customerPhone}</strong> within 3 hours to confirm decoration details.
              </p>
              <div style="background:var(--paper);border:1px solid var(--line);border-radius:var(--radius-md);padding:16px 24px;margin-bottom:24px;display:inline-block;font-size:13.5px;text-align:left;">
                <div>🔖 Booking Ref: <strong style="color:var(--coral);">${orderRef}</strong></div>
                <div>🎂 Estimated Total: <strong>$${price.toFixed(2)}</strong></div>
                ${customText ? `<div>✍️ Message: <em>"${customText}"</em></div>` : ''}
              </div>
              <br>
              <button type="button" class="button button-primary" id="reset-cake-studio-btn">Design Another Cake &rarr;</button>
            </div>
          `;

          document.querySelector('#reset-cake-studio-btn')?.addEventListener('click', () => {
            window.location.reload();
          });
        }

        showToast(`Custom Cake Booking #${orderRef} confirmed!`, 'success');
      }, 700);
    });

    // Add Custom Cake directly to cart
    if (addCakeCartBtn) {
      addCakeCartBtn.addEventListener('click', () => {
        const sizeInput = cakeForm.querySelector('input[name="cake_size"]:checked');
        const sizeText = sizeInput ? sizeInput.closest('.cake-option-card')?.querySelector('strong')?.textContent : 'Custom Cake';
        const price = calculateCustomCakePrice();
        
        addItem({
          id: `custom-cake-${Date.now()}`,
          name: `Custom ${sizeText}`,
          price: price,
          quantity: 1,
          image: '../images/strawberry-shortcake.jpg'
        });

        showToast(`Custom Cake ($${price.toFixed(2)}) added to cart! 🎂`, 'success');
      });
    }
  }

  // 3. Express Pastry Delivery Form
  const expressDeliveryForm = document.querySelector('#express-delivery-form');
  if (expressDeliveryForm) {
    expressDeliveryForm.addEventListener('submit', (event) => {
      event.preventDefault();

      const fname = document.querySelector('#fname')?.value.trim();
      const phone = document.querySelector('#pnumber')?.value.trim();
      const location = document.querySelector('#location')?.value.trim();
      const qtyRadio = expressDeliveryForm.querySelector('input[name="quantity"]:checked');
      const selection = qtyRadio ? qtyRadio.value : 'Morning Croissant Box';

      if (!fname || !phone || !location) {
        showToast('Please fill out all required fields', 'info');
        return;
      }

      const submitBtn = expressDeliveryForm.querySelector('button[type="submit"]');
      const originalText = submitBtn.innerHTML;
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<span>Dispatching express delivery...</span>';

      setTimeout(() => {
        const orderRef = `CK-EXP-${Math.floor(1000 + Math.random() * 9000)}`;
        const mainCard = document.querySelector('#contact-main-card');

        if (mainCard) {
          mainCard.innerHTML = `
            <div class="delivery-success-card" style="text-align:center;padding:30px 10px;">
              <div style="width:64px;height:64px;background:var(--teal);color:#fff;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:28px;margin:0 auto 16px;box-shadow:0 6px 20px rgba(31,95,88,0.3);">&#10003;</div>
              <span class="eyebrow" style="color:var(--coral);font-weight:800;">DELIVERY DISPATCHED</span>
              <h2 style="font-size:30px;margin:8px 0 12px;">Thank you, ${fname}!</h2>
              <p style="color:var(--muted);font-size:14.5px;max-width:480px;margin:0 auto 20px;line-height:1.65;">
                Your request for <strong>${selection}</strong> has been sent to our dispatch team in Boeung Tumpun. Our driver will call <strong>${phone}</strong> upon departure.
              </p>
              <div style="background:var(--paper);border:1px solid var(--line);border-radius:var(--radius-md);padding:16px 24px;margin-bottom:24px;display:inline-block;font-size:13.5px;">
                Reference ID: <strong style="color:var(--coral);">${orderRef}</strong> • Est. Arrival: <strong>~30-40 mins</strong>
              </div>
              <br>
              <button type="button" class="button button-primary" id="reset-express-btn">Place Another Order &rarr;</button>
            </div>
          `;

          document.querySelector('#reset-express-btn')?.addEventListener('click', () => {
            window.location.reload();
          });
        }

        showToast(`Delivery #${orderRef} dispatched! 🛵`, 'success');
      }, 600);
    });
  }

  // 4. Feedback Form
  const feedbackForm = document.querySelector('.feedback-form');
  const statusMsg = document.querySelector('.form-status');

  if (feedbackForm) {
    feedbackForm.addEventListener('submit', (event) => {
      event.preventDefault();
      const emailInput = feedbackForm.querySelector('#email');
      const feedbackInput = feedbackForm.querySelector('#feedback');
      const email = emailInput?.value.trim();
      const feedback = feedbackInput?.value.trim();

      if (!email || !feedback) {
        showToast('Please provide your email and comments', 'info');
        return;
      }

      const button = feedbackForm.querySelector('button[type="submit"]');
      const originalText = button.innerHTML;
      button.disabled = true;
      button.innerHTML = '<span>Sending feedback...</span>';

      setTimeout(() => {
        feedbackForm.reset();
        button.disabled = false;
        button.innerHTML = originalText;

        if (statusMsg) {
          statusMsg.innerHTML = '<span style="color:var(--teal);font-weight:700;">✨ Thank you! Your feedback warms our bakers\' hearts.</span>';
          statusMsg.style.display = 'block';
        }

        showToast('Thank you for your feedback! 🥐', 'success');
      }, 500);
    });
  }

  // 5. Smooth FAQ Accordion Interactions
  document.querySelectorAll('.faq-item').forEach((item) => {
    item.addEventListener('toggle', () => {
      if (item.open) {
        document.querySelectorAll('.faq-item').forEach((other) => {
          if (other !== item && other.open) {
            other.open = false;
          }
        });
      }
    });
  });
});
