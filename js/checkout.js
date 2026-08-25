import { CART_KEY, ORDER_KEY, readJson, writeJson } from './storage.js';
import { cartTotal } from './cart.js';

const cart = readJson(CART_KEY, []);
const summary = document.querySelector('#checkout-summary');
const total = document.querySelector('#checkout-total');
const form = document.querySelector('#checkout-form');
const loading = document.querySelector('.checkout-loading');
summary.innerHTML = cart.length ? cart.map((item) => `<div class="checkout-line"><span>${item.name} x${item.quantity}</span><strong>$${(item.price * item.quantity).toFixed(2)}</strong></div>`).join('') : '<p class="empty-order">Your cart is empty. Return to the menu to choose a treat.</p>';
const delivery = cart.length ? 3 : 0;
total.textContent = `$${(cartTotal(cart) + delivery).toFixed(2)}`;
form.addEventListener('submit', (event) => {
  event.preventDefault();
  if (!cart.length) return;
  const submit = form.querySelector('button[type="submit"]');
  submit.disabled = true;
  submit.textContent = 'Preparing your order...';
  loading.textContent = 'Checking the kitchen and confirming your order';
  const data = new FormData(form);
  const id = `CC-${new Date().toISOString().slice(0, 10).replaceAll('-', '')}-${Math.floor(1000 + Math.random() * 9000)}`;
  writeJson(ORDER_KEY, { id, step: 0, customer: Object.fromEntries(data), items: cart, total: cartTotal(cart) + delivery });
  localStorage.removeItem(CART_KEY);
  window.setTimeout(() => { window.location.href = `order.html?id=${id}`; }, 750);
});
