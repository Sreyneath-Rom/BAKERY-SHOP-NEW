import { addItem, getCart, removeItem, cartCount, cartTotal } from './cart.js';
import { showToast } from './toast.js';

export function setupCartDrawer({ buttonSelector = '.cart-button', openButton = null } = {}) {
  const button = document.querySelector(buttonSelector);
  const summary = document.querySelector('#order-summary');
  const items = document.querySelector('.order-items');
  const count = document.querySelector('#cart-count');
  const total = document.querySelector('#cart-total');
  const subtotal = document.querySelector('#cart-subtotal');
  const delivery = document.querySelector('#cart-delivery');
  const close = document.querySelector('.close-order');
  if (!button || !summary || !items) return;

  function render() {
    const cart = getCart();
    if (count) count.textContent = cartCount(cart);
    const itemTotal = cartTotal(cart);
    if (subtotal) subtotal.textContent = itemTotal.toFixed(2);
    if (delivery) delivery.textContent = cart.length ? '3.00' : '0.00';
    if (total) total.textContent = (itemTotal + (cart.length ? 3 : 0)).toFixed(2);
    items.innerHTML = cart.length ? cart.map((item, index) => `<div class="order-line"><img src="${item.image || '../images/logo.png'}" alt=""><span>${item.name} <small>${item.quantity} x $${item.price.toFixed(2)}</small></span><strong>$${(item.price * item.quantity).toFixed(2)}</strong><button type="button" data-remove="${index}" aria-label="Remove ${item.name}">&#10005;</button></div>`).join('') : '<p class="empty-order">Your order is waiting for something warm.</p>';
  }

  function open() { summary.classList.add('is-open'); summary.setAttribute('aria-hidden', 'false'); }
  function closeDrawer() { summary.classList.remove('is-open'); summary.setAttribute('aria-hidden', 'true'); }
  button.addEventListener('click', open);
  close?.addEventListener('click', closeDrawer);
  items.addEventListener('click', (event) => {
    const remove = event.target.closest('[data-remove]');
    if (!remove) return;
    removeItem(Number(remove.dataset.remove));
    render();
  });
  document.addEventListener('cakery-cart-change', render);
  render();
  return { render, open, close: closeDrawer };
}

export function addProductToCart(product, quantity = 1) {
  addItem(product, quantity);
  document.dispatchEvent(new CustomEvent('cakery-cart-change'));
  showToast(`${product.name} added to your order`);
}
