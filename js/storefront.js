const cart = JSON.parse(localStorage.getItem('cakery-charm-order') || '[]');
const count = document.querySelector('#cart-count');
const total = document.querySelector('#cart-total');
const summary = document.querySelector('#order-summary');
const items = document.querySelector('.order-items');
const toast = document.querySelector('.order-toast');

function saveCart() {
  localStorage.setItem('cakery-charm-order', JSON.stringify(cart));
}

function renderCart() {
  const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const orderTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  count.textContent = itemCount;
  total.textContent = orderTotal.toFixed(2);
  items.innerHTML = cart.length ? cart.map((item, index) => `<div class="order-line"><span>${item.name} <small>x${item.quantity}</small></span><strong>$${(item.price * item.quantity).toFixed(2)}</strong><button type="button" data-remove="${index}" aria-label="Remove ${item.name}">&#10005;</button></div>`).join('') : '<p class="empty-order">Your order is waiting for something warm.</p>';
}

function showToast(message) {
  toast.textContent = message;
  toast.classList.add('is-visible');
  window.setTimeout(() => toast.classList.remove('is-visible'), 2200);
}

document.querySelectorAll('.add-button').forEach((button) => {
  button.addEventListener('click', () => {
    const card = button.closest('.bakery-item');
    const quantity = Math.max(1, Math.min(10, Number(card.querySelector('.quantity').value) || 1));
    const existing = cart.find((item) => item.name === card.dataset.product);
    button.disabled = true;
    button.textContent = 'Adding...';
    window.setTimeout(() => {
      if (existing) existing.quantity += quantity;
      else cart.push({ name: card.dataset.product, price: Number(card.dataset.price), quantity });
      saveCart();
      renderCart();
      button.disabled = false;
      button.textContent = 'Added';
      showToast(`${card.dataset.product} added to your order`);
      window.setTimeout(() => { button.textContent = 'Add to order'; }, 1200);
    }, 420);
  });
});

document.querySelector('.cart-button').addEventListener('click', () => {
  summary.classList.add('is-open');
  summary.setAttribute('aria-hidden', 'false');
});
document.querySelector('.close-order').addEventListener('click', () => {
  summary.classList.remove('is-open');
  summary.setAttribute('aria-hidden', 'true');
});
items.addEventListener('click', (event) => {
  const removeButton = event.target.closest('[data-remove]');
  if (!removeButton) return;
  cart.splice(Number(removeButton.dataset.remove), 1);
  saveCart();
  renderCart();
});
renderCart();