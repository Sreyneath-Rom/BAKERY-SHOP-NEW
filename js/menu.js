const storageKey = 'cakery-charm-order';
const favorites = JSON.parse(localStorage.getItem('cakery-charm-favorites') || '[]');
function getCart() { return JSON.parse(localStorage.getItem(storageKey) || '[]'); }
function saveCart(cart) { localStorage.setItem(storageKey, JSON.stringify(cart)); }
function addProductToCart(product, quantity = 1) { const cart = getCart(); const existing = cart.find((item) => item.name === product.name); if (existing) existing.quantity += quantity; else cart.push({ ...product, quantity }); saveCart(cart); renderCart(); }
function setupCartDrawer() {
  const summary = document.querySelector('#order-summary'); const items = document.querySelector('.order-items'); const count = document.querySelector('#cart-count'); const total = document.querySelector('#cart-total'); const subtotal = document.querySelector('#cart-subtotal'); const delivery = document.querySelector('#cart-delivery');
  function renderCart() { const cart = getCart(); const sum = cart.reduce((value, item) => value + item.price * item.quantity, 0); if (count) count.textContent = cart.reduce((value, item) => value + item.quantity, 0); if (subtotal) subtotal.textContent = sum.toFixed(2); if (delivery) delivery.textContent = cart.length ? '3.00' : '0.00'; if (total) total.textContent = (sum + (cart.length ? 3 : 0)).toFixed(2); if (items) items.innerHTML = cart.length ? cart.map((item, index) => `<div class="order-line"><img src="${item.image || '../images/logo.png'}" alt=""><span>${item.name} <small>${item.quantity} x $${item.price.toFixed(2)}</small></span><strong>$${(item.price * item.quantity).toFixed(2)}</strong><button type="button" data-remove="${index}" aria-label="Remove ${item.name}">&#10005;</button></div>`).join('') : '<p class="empty-order">Your order is waiting for something warm.</p>'; }
  document.querySelector('.cart-button')?.addEventListener('click', () => { summary.classList.add('is-open'); summary.setAttribute('aria-hidden', 'false'); }); document.querySelector('.close-order')?.addEventListener('click', () => { summary.classList.remove('is-open'); summary.setAttribute('aria-hidden', 'true'); }); items?.addEventListener('click', (event) => { const remove = event.target.closest('[data-remove]'); if (remove) { const cart = getCart(); cart.splice(Number(remove.dataset.remove), 1); saveCart(cart); renderCart(); } }); renderCart();
}
function renderCart() { const cart = getCart(); const sum = cart.reduce((value, item) => value + item.price * item.quantity, 0); const count = document.querySelector('#cart-count'); const total = document.querySelector('#cart-total'); const subtotal = document.querySelector('#cart-subtotal'); const delivery = document.querySelector('#cart-delivery'); if (count) count.textContent = cart.reduce((value, item) => value + item.quantity, 0); if (subtotal) subtotal.textContent = sum.toFixed(2); if (delivery) delivery.textContent = cart.length ? '3.00' : '0.00'; if (total) total.textContent = (sum + (cart.length ? 3 : 0)).toFixed(2); }

const modal = document.querySelector('#product-modal');
const modalImage = document.querySelector('#modal-image');
const modalName = document.querySelector('#modal-name');
const modalDescription = document.querySelector('#modal-description');
const modalPrice = document.querySelector('#modal-price');
const modalQuantity = document.querySelector('#modal-quantity');
let selectedProduct = null;

setupCartDrawer();

function closeModal() {
  modal.classList.remove('is-open');
  modal.setAttribute('aria-hidden', 'true');
}

document.querySelectorAll('.menu .item').forEach((card) => {
  const name = card.querySelector('p').textContent.trim();
  const price = Number(card.querySelector('span').textContent.replace(/[^0-9.]/g, ''));
  const image = card.querySelector('img').src;
  const product = { name, price, image, description: `Freshly made ${name.toLowerCase()} from the Cakery Charm kitchen.` };
  const section = card.closest('.grid').previousElementSibling.previousElementSibling.textContent.toLowerCase();
  const category = section.includes('cake') ? 'cake' : section.includes('sandwich') ? 'sandwich' : section.includes('drink') ? 'drink' : section.includes('bread') ? 'bread' : 'pastry';
  card.dataset.category = category;
  card.dataset.rating = '4.9';
  card.insertAdjacentHTML('beforeend', `<div class="card-meta"><span class="card-category">${category}</span><span class="card-rating">&#9733; 4.9</span><button class="favorite-button ${favorites.includes(name) ? 'is-favorite' : ''}" type="button" aria-label="${favorites.includes(name) ? 'Remove' : 'Add'} ${name} from favorites">&#9825;</button></div><button class="menu-add-button" type="button">Add to cart</button><button class="quick-view-button" type="button">Quick view</button>`);
  card.addEventListener('click', (event) => {
    const favoriteButton = event.target.closest('.favorite-button');
    if (favoriteButton) {
      event.stopPropagation();
      const favoriteIndex = favorites.indexOf(name);
      if (favoriteIndex >= 0) favorites.splice(favoriteIndex, 1); else favorites.push(name);
      localStorage.setItem('cakery-charm-favorites', JSON.stringify(favorites));
      favoriteButton.classList.toggle('is-favorite');
      favoriteButton.setAttribute('aria-label', `${favoriteButton.classList.contains('is-favorite') ? 'Remove' : 'Add'} ${name} from favorites`);
      return;
    }
    if (event.target.closest('.menu-add-button')) {
      event.stopPropagation();
      addProductToCart(product);
      event.target.textContent = 'Added';
      window.setTimeout(() => { event.target.textContent = 'Add to cart'; }, 1000);
      return;
    }
    selectedProduct = product;
    modalImage.src = image;
    modalImage.alt = name;
    modalName.textContent = name;
    modalDescription.textContent = product.description;
    modalPrice.textContent = `$${price.toFixed(2)}`;
    modalQuantity.value = 1;
    modal.classList.add('is-open');
    modal.setAttribute('aria-hidden', 'false');
  });
});

document.querySelector('.modal-close').addEventListener('click', closeModal);
modal.addEventListener('click', (event) => { if (event.target === modal) closeModal(); });
document.querySelector('#modal-add').addEventListener('click', () => {
  if (!selectedProduct) return;
  addProductToCart(selectedProduct, Math.max(1, Number(modalQuantity.value) || 1));
  closeModal();
});

document.querySelector('#quantity-minus').addEventListener('click', () => { modalQuantity.value = Math.max(1, Number(modalQuantity.value) - 1); });
document.querySelector('#quantity-plus').addEventListener('click', () => { modalQuantity.value = Math.min(10, Number(modalQuantity.value) + 1); });
document.querySelectorAll('[data-filter]').forEach((filterButton) => {
  filterButton.addEventListener('click', () => {
    document.querySelectorAll('[data-filter]').forEach((button) => button.classList.remove('is-active'));
    filterButton.classList.add('is-active');
    document.querySelectorAll('.menu .item').forEach((card) => { card.hidden = filterButton.dataset.filter !== 'all' && card.dataset.category !== filterButton.dataset.filter; });
    document.querySelectorAll('.menu .grid').forEach((grid) => { grid.hidden = !grid.querySelector('.item:not([hidden])'); });
  });
});

function filterProducts() {
  const query = document.querySelector('#product-search').value.toLowerCase().trim();
  const activeFilter = document.querySelector('.filter-button.is-active').dataset.filter;
  document.querySelectorAll('.menu .item').forEach((card) => {
    const matchesText = card.textContent.toLowerCase().includes(query);
    const matchesCategory = activeFilter === 'all' || card.dataset.category === activeFilter;
    card.hidden = !matchesText || !matchesCategory;
  });
  document.querySelectorAll('.menu .grid').forEach((grid) => { grid.hidden = !grid.querySelector('.item:not([hidden])'); });
}
document.querySelector('#product-search').addEventListener('input', filterProducts);
document.querySelector('#product-sort').addEventListener('change', (event) => {
  document.querySelectorAll('.menu .grid').forEach((grid) => {
    const cards = [...grid.querySelectorAll('.menu .item')];
    cards.sort((first, second) => {
      const firstPrice = Number(first.querySelector('span').textContent.replace(/[^0-9.]/g, ''));
      const secondPrice = Number(second.querySelector('span').textContent.replace(/[^0-9.]/g, ''));
      if (event.target.value === 'price-low') return firstPrice - secondPrice;
      if (event.target.value === 'price-high') return secondPrice - firstPrice;
      return event.target.value === 'rating' ? second.dataset.rating - first.dataset.rating : 0;
    });
    cards.forEach((card) => grid.append(card));
  });
  filterProducts();
});
