const cartKey = 'cakery-charm-order';
const favoriteKey = 'cakery-charm-favorites';
const cart = JSON.parse(localStorage.getItem(cartKey) || '[]');
const favorites = JSON.parse(localStorage.getItem(favoriteKey) || '[]');
function saveCart() { localStorage.setItem(cartKey, JSON.stringify(cart)); }
function renderCart() { const count = document.querySelector('#cart-count'); const total = document.querySelector('#cart-total'); const subtotal = document.querySelector('#cart-subtotal'); const delivery = document.querySelector('#cart-delivery'); const items = document.querySelector('.order-items'); const sum = cart.reduce((value, item) => value + item.price * item.quantity, 0); if (count) count.textContent = cart.reduce((value, item) => value + item.quantity, 0); if (subtotal) subtotal.textContent = sum.toFixed(2); if (delivery) delivery.textContent = cart.length ? '3.00' : '0.00'; if (total) total.textContent = (sum + (cart.length ? 3 : 0)).toFixed(2); if (items) items.innerHTML = cart.length ? cart.map((item, index) => `<div class="order-line"><img src="${item.image || 'images/logo.png'}" alt=""><span>${item.name} <small>${item.quantity} x $${item.price.toFixed(2)}</small></span><strong>$${(item.price * item.quantity).toFixed(2)}</strong><button type="button" data-remove="${index}" aria-label="Remove ${item.name}">&#10005;</button></div>`).join('') : '<p class="empty-order">Your order is waiting for something warm.</p>'; }
document.querySelectorAll('.bakery-item').forEach((card) => { const name = card.dataset.product; const category = name === 'Strawberry' ? 'drink' : name === 'Chocolate' ? 'pastry' : 'bread'; const actions = card.querySelector('.card-actions'); actions.insertAdjacentHTML('beforebegin', `<div class="card-meta"><span class="card-category">${category}</span><span class="card-rating">&#9733; 4.9</span><button class="favorite-button ${favorites.includes(name) ? 'is-favorite' : ''}" type="button" aria-label="Favorite ${name}">&#9825;</button></div>`); card.querySelector('.favorite-button').addEventListener('click', (event) => { event.stopPropagation(); const index = favorites.indexOf(name); if (index >= 0) favorites.splice(index, 1); else favorites.push(name); localStorage.setItem(favoriteKey, JSON.stringify(favorites)); event.currentTarget.classList.toggle('is-favorite'); }); });
document.querySelectorAll('.add-button').forEach((button) => {
  button.addEventListener('click', () => {
    const card = button.closest('.bakery-item');
    const quantity = Math.max(1, Math.min(10, Number(card.querySelector('.quantity').value) || 1));
    button.disabled = true;
    button.textContent = 'Adding...';
    window.setTimeout(() => {
      const item = cart.find((entry) => entry.name === card.dataset.product);
      if (item) item.quantity += quantity; else cart.push({ name: card.dataset.product, price: Number(card.dataset.price), quantity, image: card.querySelector('img').src });
      saveCart(); renderCart();
      button.disabled = false;
      button.textContent = 'Added';
      window.setTimeout(() => { button.textContent = 'Add to order'; }, 1200);
    }, 420);
  });
});
const drawer = document.querySelector('#order-summary');
document.querySelector('.cart-button')?.addEventListener('click', () => { drawer.classList.add('is-open'); drawer.setAttribute('aria-hidden', 'false'); });
document.querySelector('.close-order')?.addEventListener('click', () => { drawer.classList.remove('is-open'); drawer.setAttribute('aria-hidden', 'true'); });
document.querySelector('.order-items')?.addEventListener('click', (event) => { const remove = event.target.closest('[data-remove]'); if (remove) { cart.splice(Number(remove.dataset.remove), 1); saveCart(); renderCart(); } });
renderCart();
