import { addProductToCart } from './cart-ui.js';
import { FAVORITES_KEY, readJson, writeJson } from './storage.js';
import { showToast } from './toast.js';
import { PRODUCTS, getProductById } from './products.js';

document.addEventListener('DOMContentLoaded', () => {
  const modal = document.querySelector('#product-modal');
  const modalImage = document.querySelector('#modal-image');
  const modalName = document.querySelector('#modal-name');
  const modalDescription = document.querySelector('#modal-description');
  const modalPrice = document.querySelector('#modal-price');
  const modalQuantity = document.querySelector('#modal-quantity');
  const modalAddBtn = document.querySelector('#modal-add');
  const modalCloseBtn = document.querySelector('.modal-close');
  const minusBtn = document.querySelector('#quantity-minus');
  const plusBtn = document.querySelector('#quantity-plus');
  const searchInput = document.querySelector('#product-search');
  const sortSelect = document.querySelector('#product-sort');
  const filterButtons = document.querySelectorAll('.filter-button[data-filter]');
  const dietaryPills = document.querySelectorAll('.dietary-pill[data-dietary]');
  const menuContainer = document.querySelector('.menu');

  let currentProduct = null;
  let activeCategory = 'all';
  let activeDietary = 'all';
  let currentSort = 'featured';
  let searchQuery = '';

  // Render the menu items grouped by categories or flat
  function renderMenu() {
    // Filter by category, search, and dietary
    let filtered = PRODUCTS.filter((p) => {
      // Category match
      let matchCat = true;
      if (activeCategory === 'bread') matchCat = p.category === 'bread' || p.category === 'pastry';
      else if (activeCategory !== 'all') matchCat = p.category === activeCategory;

      // Dietary match
      let matchDietary = true;
      if (activeDietary === 'bestseller') matchDietary = p.badge === 'Bestseller' || p.rating >= 4.9;
      else if (activeDietary !== 'all') matchDietary = p.dietary.some(d => d.toLowerCase().includes(activeDietary.toLowerCase()));

      // Search match
      let matchSearch = true;
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        matchSearch = p.name.toLowerCase().includes(q) ||
                      p.category.toLowerCase().includes(q) ||
                      p.description.toLowerCase().includes(q) ||
                      p.dietary.some(d => d.toLowerCase().includes(q));
      }

      return matchCat && matchDietary && matchSearch;
    });

    // Sort items
    filtered.sort((a, b) => {
      if (currentSort === 'price-low') return a.price - b.price;
      if (currentSort === 'price-high') return b.price - a.price;
      if (currentSort === 'rating') return b.rating - a.rating;
      return 0; // featured default
    });

    // Group items by category for clean section headers if viewing 'all'
    const categoriesMeta = [
      { key: 'pastry_bread', title: 'Artisan Breads & Viennoiserie', desc: 'Crafted with 100% French AOP butter and 72-hour slow fermented sourdough.', items: filtered.filter(p => p.category === 'bread' || p.category === 'pastry') },
      { key: 'cake', title: 'Handcrafted Celebration Cakes', desc: 'Sponge layers, whipped ganache, and natural fruit coulis baked fresh daily.', items: filtered.filter(p => p.category === 'cake') },
      { key: 'sandwich', title: 'Savory Brioche Sandwiches', desc: 'Fresh toasted meals with premium cheeses, farm-fresh eggs, and seasoned fillings.', items: filtered.filter(p => p.category === 'sandwich') },
      { key: 'drink', title: 'Specialty Cold & Hot Brews', desc: 'Mondulkiri single-origin espresso, ceremonial Japanese matcha, and fruit coolers.', items: filtered.filter(p => p.category === 'drink') }
    ];

    const currentFavs = readJson(FAVORITES_KEY, []);

    // Remove previously rendered dynamic sections
    const existingDynamic = document.querySelectorAll('.menu-dynamic-section, .menu-empty-state, .menu-result-bar');
    existingDynamic.forEach(el => el.remove());

    // Also hide legacy static headings and grids if present
    document.querySelectorAll('.menu > h2, .menu > .description, .menu > .grid').forEach(el => el.style.display = 'none');

    // Create Result Bar
    const resultBar = document.createElement('div');
    resultBar.className = 'menu-result-bar reveal-on-scroll is-visible';
    resultBar.innerHTML = `
      <span>Showing <strong>${filtered.length}</strong> fresh bakehouse item${filtered.length === 1 ? '' : 's'}</span>
      ${searchQuery ? `<button class="clear-search-chip" type="button">Clear search "${searchQuery}" &times;</button>` : ''}
    `;
    menuContainer.appendChild(resultBar);

    resultBar.querySelector('.clear-search-chip')?.addEventListener('click', () => {
      if (searchInput) searchInput.value = '';
      searchQuery = '';
      renderMenu();
    });

    if (filtered.length === 0) {
      const emptyState = document.createElement('div');
      emptyState.className = 'menu-empty-state reveal-on-scroll is-visible';
      emptyState.innerHTML = `
        <div class="empty-icon">🥖</div>
        <h3>No treats match your filters</h3>
        <p>We couldn't find any baked goods matching your search criteria.</p>
        <button type="button" class="button button-primary reset-filter-btn">Reset All Filters</button>
      `;
      menuContainer.appendChild(emptyState);
      emptyState.querySelector('.reset-filter-btn')?.addEventListener('click', () => {
        activeCategory = 'all';
        activeDietary = 'all';
        searchQuery = '';
        currentSort = 'featured';
        if (searchInput) searchInput.value = '';
        if (sortSelect) sortSelect.value = 'featured';
        filterButtons.forEach(btn => btn.classList.toggle('is-active', btn.dataset.filter === 'all'));
        dietaryPills.forEach(pill => pill.classList.toggle('is-active', pill.dataset.dietary === 'all'));
        renderMenu();
      });
      return;
    }

    // If filtering by a specific category or searching, render directly
    if (activeCategory !== 'all' || searchQuery || activeDietary !== 'all') {
      const section = document.createElement('section');
      section.className = 'menu-dynamic-section reveal-on-scroll is-visible';
      section.innerHTML = `
        <div class="grid">
          ${filtered.map(p => renderProductCard(p, currentFavs)).join('')}
        </div>
      `;
      menuContainer.appendChild(section);
    } else {
      // Group by category
      categoriesMeta.forEach(cat => {
        if (cat.items.length === 0) return;
        const section = document.createElement('section');
        section.className = 'menu-dynamic-section reveal-on-scroll is-visible';
        section.innerHTML = `
          <div class="category-header-wrap">
            <h2>${cat.title}</h2>
            <p class="description">${cat.desc}</p>
          </div>
          <div class="grid">
            ${cat.items.map(p => renderProductCard(p, currentFavs)).join('')}
          </div>
        `;
        menuContainer.appendChild(section);
      });
    }

    bindCardEvents();
  }

  function renderProductCard(product, currentFavs) {
    const isFav = currentFavs.includes(product.name);
    const badgeHtml = product.badge ? `<span class="promo-badge-ribbon">${product.badge}</span>` : '';
    const dietaryHtml = (product.dietary || []).map(d => `<span class="tax-tag">${d}</span>`).join(' &bull; ');

    return `
      <article class="bakery-item reveal-on-scroll is-visible" data-id="${product.id}" data-name="${product.name}" data-product="${product.name}" data-price="${product.price.toFixed(2)}" data-category="${product.category}">
        <div class="item-image-wrapper">
          <img src="${product.image}" alt="${product.name}" loading="lazy" decoding="async">
          ${badgeHtml}
          <button class="favorite-button ${isFav ? 'is-favorite' : ''}" type="button" aria-label="${isFav ? 'Remove from' : 'Add to'} favorites" data-name="${product.name}">
            ${isFav ? '&#9829;' : '&#9825;'}
          </button>
        </div>
        <div class="card-top-meta">
          <span class="item-category-label">${product.category}</span>
          <span class="rating-badge-summary">&#9733; ${product.rating.toFixed(1)} (${product.reviewsCount})</span>
        </div>
        <div class="item-info">
          <strong>${product.name}</strong>
          <small>${product.description.length > 76 ? product.description.slice(0, 76) + '...' : product.description}</small>
          <div class="price-row">
            <b class="price-val">$${product.price.toFixed(2)}</b>
            ${dietaryHtml ? `<span class="tax-tag">${dietaryHtml}</span>` : '<span class="tax-tag">Freshly baked</span>'}
          </div>
        </div>
        <div class="card-actions">
          <div class="stepper-wrap">
            <button type="button" class="home-qty-btn" data-step="-1" aria-label="Decrease quantity">&#8722;</button>
            <input class="quantity" type="number" min="1" max="20" value="1" aria-label="${product.name} quantity">
            <button type="button" class="home-qty-btn" data-step="1" aria-label="Increase quantity">&#43;</button>
          </div>
          <button class="home-add-btn add-button" type="button">
            <span>Add to order</span>
          </button>
          <button class="home-qty-btn customize-btn" type="button" aria-label="Customise ${product.name}" title="Options & Sizing">⚙</button>
        </div>
      </article>
    `;
  }

  function bindCardEvents() {
    document.querySelectorAll('.menu .bakery-item').forEach((card) => {
      const id = card.dataset.id;
      const product = getProductById(id) || PRODUCTS.find(p => p.name === card.dataset.name) || PRODUCTS.find(p => p.name === card.dataset.product);
      if (!product) return;

      const qtyInput = card.querySelector('.quantity');

      // Steppers
      card.querySelectorAll('.home-qty-btn[data-step]').forEach(btn => {
        btn.addEventListener('click', (e) => {
          e.stopPropagation();
          const step = Number(btn.dataset.step);
          if (qtyInput) {
            let val = (Number(qtyInput.value) || 1) + step;
            val = Math.max(1, Math.min(20, val));
            qtyInput.value = val;
          }
        });
      });

      // Direct Quantity Input Validation
      qtyInput?.addEventListener('change', () => {
        let val = Number(qtyInput.value) || 1;
        val = Math.max(1, Math.min(20, val));
        qtyInput.value = val;
      });

      // Favorite toggle
      const favBtn = card.querySelector('.favorite-button');
      favBtn?.addEventListener('click', (e) => {
        e.stopPropagation();
        const favList = readJson(FAVORITES_KEY, []);
        const idx = favList.indexOf(product.name);
        if (idx >= 0) {
          favList.splice(idx, 1);
          favBtn.classList.remove('is-favorite');
          favBtn.innerHTML = '&#9825;';
          favBtn.setAttribute('aria-label', `Add ${product.name} to favorites`);
          showToast(`Removed ${product.name} from favorites`, 'info');
        } else {
          favList.push(product.name);
          favBtn.classList.add('is-favorite');
          favBtn.innerHTML = '&#9829;';
          favBtn.setAttribute('aria-label', `Remove ${product.name} from favorites`);
          showToast(`Saved ${product.name} to your favorites!`, 'success');
        }
        writeJson(FAVORITES_KEY, favList);
      });

      // Add to Order
      const addBtn = card.querySelector('.add-button');
      addBtn?.addEventListener('click', (e) => {
        e.stopPropagation();
        const qty = Math.max(1, Math.min(20, Number(qtyInput?.value) || 1));
        const originalHtml = addBtn.innerHTML;
        addBtn.disabled = true;
        addBtn.innerHTML = '<span>Adding...</span>';

        setTimeout(() => {
          addProductToCart(product, qty);
          addBtn.disabled = false;
          addBtn.innerHTML = '<span>Added ✓</span>';
          addBtn.style.background = 'var(--coral)';
          addBtn.style.color = '#ffffff';

          setTimeout(() => {
            addBtn.innerHTML = originalHtml;
            addBtn.style.background = '';
            addBtn.style.color = '';
          }, 1400);
        }, 200);
      });

      // Customise / Options button & Click image/title to open modal
      const customizeBtn = card.querySelector('.customize-btn');
      customizeBtn?.addEventListener('click', (e) => {
        e.stopPropagation();
        openProductModal(product);
      });

      card.querySelector('.item-image-wrapper')?.addEventListener('click', (e) => {
        if (!e.target.closest('.favorite-button')) {
          openProductModal(product);
        }
      });

      card.querySelector('.item-info strong')?.addEventListener('click', (e) => {
        e.stopPropagation();
        openProductModal(product);
      });
    });
  }

  // Modal Functionality
  function openProductModal(product) {
    if (!modal) return;
    currentProduct = product;

    if (modalImage) {
      modalImage.src = product.image;
      modalImage.alt = product.name;
    }
    if (modalName) modalName.textContent = product.name;
    if (modalDescription) modalDescription.textContent = product.description;
    if (modalQuantity) modalQuantity.value = 1;

    // Render sizes fieldset dynamically based on product
    const fieldset = modal.querySelector('.modal-options fieldset');
    if (fieldset) {
      const sizes = product.sizes && product.sizes.length > 0 ? product.sizes : [
        { label: 'Standard Single', priceMultiplier: 1.0, value: 'Standard' }
      ];

      fieldset.innerHTML = `
        <legend>Select Option / Size</legend>
        ${sizes.map((s, idx) => `
          <label class="modal-size-label">
            <input name="size" type="radio" value="${s.value}" data-multiplier="${s.priceMultiplier}" ${idx === 0 ? 'checked' : ''}>
            <span>${s.label} ($${(product.price * s.priceMultiplier).toFixed(2)})</span>
          </label>
        `).join('')}
      `;

      fieldset.querySelectorAll('input[name="size"]').forEach(radio => {
        radio.addEventListener('change', updateModalPrice);
      });
    }

    updateModalPrice();

    modal.classList.add('is-open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    if (!modal) return;
    modal.classList.remove('is-open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  function getCalculatedModalPrice() {
    if (!currentProduct) return 2.50;
    const checkedRadio = modal.querySelector('input[name="size"]:checked');
    const multiplier = checkedRadio ? parseFloat(checkedRadio.dataset.multiplier) || 1.0 : 1.0;
    return currentProduct.price * multiplier;
  }

  function updateModalPrice() {
    if (!modalPrice || !currentProduct) return;
    const unitPrice = getCalculatedModalPrice();
    const qty = Math.max(1, Number(modalQuantity?.value) || 1);
    modalPrice.textContent = `$${(unitPrice * qty).toFixed(2)}`;
  }

  if (modalCloseBtn) modalCloseBtn.addEventListener('click', closeModal);
  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeModal();
    });
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal?.classList.contains('is-open')) {
      closeModal();
    }
  });

  if (minusBtn) {
    minusBtn.addEventListener('click', () => {
      if (modalQuantity) {
        modalQuantity.value = Math.max(1, (Number(modalQuantity.value) || 1) - 1);
        updateModalPrice();
      }
    });
  }

  if (plusBtn) {
    plusBtn.addEventListener('click', () => {
      if (modalQuantity) {
        modalQuantity.value = Math.min(20, (Number(modalQuantity.value) || 1) + 1);
        updateModalPrice();
      }
    });
  }

  if (modalQuantity) {
    modalQuantity.addEventListener('input', updateModalPrice);
  }

  if (modalAddBtn) {
    modalAddBtn.addEventListener('click', () => {
      if (!currentProduct) return;
      const qty = Math.max(1, Number(modalQuantity?.value) || 1);
      const checkedRadio = modal.querySelector('input[name="size"]:checked');
      const sizeVal = checkedRadio ? checkedRadio.value : 'Standard';
      const unitPrice = getCalculatedModalPrice();

      addProductToCart(currentProduct, qty, {
        size: sizeVal,
        price: unitPrice
      });

      closeModal();
    });
  }

  // Filter Buttons
  filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      filterButtons.forEach(b => b.classList.remove('is-active'));
      btn.classList.add('is-active');
      activeCategory = btn.dataset.filter || 'all';
      renderMenu();
    });
  });

  // Dietary Pills
  dietaryPills.forEach(pill => {
    pill.addEventListener('click', () => {
      dietaryPills.forEach(p => p.classList.remove('is-active'));
      pill.classList.add('is-active');
      activeDietary = pill.dataset.dietary || 'all';
      renderMenu();
    });
  });

  // Search Input
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      searchQuery = e.target.value.trim();
      renderMenu();
    });
  }

  // Sort Select
  if (sortSelect) {
    sortSelect.addEventListener('change', (e) => {
      currentSort = e.target.value;
      renderMenu();
    });
  }

  // Initial Check for URL query param
  const urlParams = new URLSearchParams(window.location.search);
  const categoryParam = urlParams.get('category');
  if (categoryParam) {
    activeCategory = categoryParam;
    filterButtons.forEach(b => b.classList.toggle('is-active', b.dataset.filter === categoryParam));
  }

  // Initial render
  renderMenu();
});
