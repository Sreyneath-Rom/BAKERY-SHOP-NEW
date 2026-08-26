import { addItem, getCart, removeItem, updateQuantity, cartCount, cartTotal } from './cart.js';
import { showToast } from './toast.js';

export function setupCartDrawer({ buttonSelector = '.cart-button', isNestedPage = false } = {}) {
  const summary = document.querySelector('#order-summary');
  if (!summary) return;

  const itemsContainer = summary.querySelector('.order-items');
  const countEl = document.querySelector('#cart-count');
  const totalEl = summary.querySelector('#cart-total');
  const subtotalEl = summary.querySelector('#cart-subtotal');
  const deliveryEl = summary.querySelector('#cart-delivery');
  const closeBtn = summary.querySelector('.close-order');
  const checkoutBtn = summary.querySelector('.checkout-button');

  const basePath = isNestedPage ? '../' : './';
  const checkoutPath = isNestedPage ? 'checkout.html' : 'pages/checkout.html';
  const menuPath = isNestedPage ? 'menu.html' : 'pages/menu.html';

  function render() {
    const cart = getCart();
    const count = cartCount(cart);
    const itemTotal = cartTotal(cart);
    const deliveryFee = cart.length > 0 ? 3.00 : 0.00;
    const finalTotal = itemTotal + deliveryFee;

    // Update badge counts across page
    document.querySelectorAll('#cart-count, .cart-badge-count').forEach(el => {
      el.textContent = count;
    });

    if (subtotalEl) subtotalEl.textContent = itemTotal.toFixed(2);
    if (deliveryEl) deliveryEl.textContent = deliveryFee.toFixed(2);
    if (totalEl) totalEl.textContent = finalTotal.toFixed(2);

    if (checkoutBtn) {
      if (cart.length === 0) {
        checkoutBtn.setAttribute('aria-disabled', 'true');
        checkoutBtn.style.opacity = '0.5';
        checkoutBtn.style.pointerEvents = 'none';
      } else {
        checkoutBtn.removeAttribute('aria-disabled');
        checkoutBtn.style.opacity = '1';
        checkoutBtn.style.pointerEvents = 'auto';
        checkoutBtn.href = checkoutPath;
      }
    }

    if (itemsContainer) {
      if (cart.length === 0) {
        itemsContainer.innerHTML = `
          <div class="empty-order-state">
            <div class="empty-order-icon">🥐</div>
            <p class="empty-order-title">Your cart is empty</p>
            <p class="empty-order-sub">Fresh breads and sweet bakes are waiting for you.</p>
            <a class="button button-primary empty-order-btn" href="${menuPath}">Explore Menu &rarr;</a>
          </div>
        `;
      } else {
        itemsContainer.innerHTML = cart.map((item, index) => {
          const imgSrc = item.image.startsWith('http') || item.image.startsWith('https') 
            ? item.image 
            : (item.image.startsWith('/') ? item.image : basePath + item.image.replace(/^\.\//, ''));
          return `
            <div class="order-line-item" data-index="${index}">
              <img class="order-line-img" src="${imgSrc}" alt="${item.name}" onerror="this.src='${basePath}images/logo.png'">
              <div class="order-line-info">
                <strong class="order-line-name">${item.name}</strong>
                <span class="order-line-price">$${Number(item.price).toFixed(2)} each</span>
                <div class="order-line-stepper">
                  <button type="button" class="qty-btn" data-action="decrease" data-index="${index}" aria-label="Decrease quantity for ${item.name}">&#8722;</button>
                  <span class="qty-display">${item.quantity}</span>
                  <button type="button" class="qty-btn" data-action="increase" data-index="${index}" aria-label="Increase quantity for ${item.name}">&#43;</button>
                </div>
              </div>
              <div class="order-line-end">
                <strong class="order-line-total">$${(item.price * item.quantity).toFixed(2)}</strong>
                <button type="button" class="remove-item-btn" data-action="remove" data-index="${index}" aria-label="Remove ${item.name}">&#10005;</button>
              </div>
            </div>
          `;
        }).join('');
      }
    }
  }

  function openDrawer() {
    summary.classList.add('is-open');
    summary.setAttribute('aria-hidden', 'false');
    document.body.classList.add('cart-drawer-open');
  }

  function closeDrawer() {
    summary.classList.remove('is-open');
    summary.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('cart-drawer-open');
  }

  // Open buttons
  document.querySelectorAll(buttonSelector).forEach(btn => {
    btn.addEventListener('click', (e) => {
      // If on checkout page, allow normal link navigation if desired, or open drawer
      if (window.location.pathname.endsWith('checkout.html') && btn.tagName === 'A') {
        return;
      }
      e.preventDefault();
      openDrawer();
    });
  });

  if (closeBtn) closeBtn.addEventListener('click', closeDrawer);

  // Esc key listener
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && summary.classList.contains('is-open')) {
      closeDrawer();
    }
  });

  // Event delegation on itemsContainer for qty changes and removal
  if (itemsContainer) {
    itemsContainer.addEventListener('click', (e) => {
      const btn = e.target.closest('button[data-action]');
      if (!btn) return;
      const index = Number(btn.dataset.index);
      const action = btn.dataset.action;
      const cart = getCart();

      if (action === 'remove') {
        const item = cart[index];
        removeItem(index);
        render();
        if (item) showToast(`Removed ${item.name}`, 'info');
      } else if (action === 'increase') {
        updateQuantity(index, (cart[index]?.quantity || 1) + 1);
        render();
      } else if (action === 'decrease') {
        const currentQty = cart[index]?.quantity || 1;
        if (currentQty <= 1) {
          removeItem(index);
          showToast(`Removed ${cart[index]?.name || 'item'}`, 'info');
        } else {
          updateQuantity(index, currentQty - 1);
        }
        render();
      }
    });
  }

  // Sync when cart changes elsewhere
  document.addEventListener('cakery-cart-change', render);

  // Initial render
  render();

  return { render, open: openDrawer, close: closeDrawer };
}

export function addProductToCart(product, quantity = 1, options = {}) {
  addItem(product, quantity, options);
  showToast(`Added ${quantity > 1 ? quantity + 'x ' : ''}${product.name} to cart!`, 'success');
}
