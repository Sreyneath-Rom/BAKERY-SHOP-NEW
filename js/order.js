import { CART_KEY, ORDER_KEY, readJson, writeJson } from './storage.js';

const order = readJson(ORDER_KEY, null);
const id = document.querySelector('#order-id');
const status = document.querySelector('#order-status');
const progress = document.querySelector('.status-progress');
const steps = document.querySelectorAll('.status-step');
const orderItems = document.querySelector('#order-items');
const message = document.querySelector('.order-message');
const cancel = document.querySelector('#cancel-order');
if (order) {
  id.textContent = order.id;
  const states = ['Order received', 'Payment confirmed', 'Preparing your order', 'Baking', 'Ready for pickup'];
  let step = Math.min(order.step || 0, states.length - 1);
  function render() { status.textContent = states[step]; progress.style.setProperty('--progress', `${step / (states.length - 1) * 100}%`); steps.forEach((item, index) => { item.classList.toggle('is-complete', index < step); item.classList.toggle('is-current', index === step); }); }
  render();
  orderItems.innerHTML = order.items.map((item) => `<p>${item.name} x${item.quantity} <strong>$${(item.price * item.quantity).toFixed(2)}</strong></p>`).join('');
  cancel.addEventListener('click', () => { localStorage.removeItem(ORDER_KEY); cancel.disabled = true; cancel.textContent = 'Order cancelled'; message.textContent = 'Your order was cancelled. We hope to bake for you another day.'; });
  document.querySelector('.order-actions a').addEventListener('click', () => writeJson(CART_KEY, order.items));
  window.setInterval(() => { if (step < states.length - 1) { step += 1; render(); } }, 5000);
} else { id.textContent = 'No active order'; status.textContent = 'Start an order from the menu.'; }
