import { addProductToCart } from './cart-ui.js';
import { FAVORITES_KEY, readJson, writeJson } from './storage.js';
import { showToast } from './toast.js';
import { PRODUCTS, DAILY_SETS } from './products.js';

document.addEventListener('DOMContentLoaded', () => {
  // 1. Dynamic Live Oven Schedule & Hero Status
  const heroLiveStatusText = document.getElementById('hero-live-status-text');
  const now = new Date();
  const currentHour = now.getHours();

  const morningCard = document.getElementById('batch-morning');
  const middayCard = document.getElementById('batch-midday');
  const afternoonCard = document.getElementById('batch-afternoon');

  if (morningCard && middayCard && afternoonCard) {
    // Reset active
    [morningCard, middayCard, afternoonCard].forEach(c => c.classList.remove('is-active'));

    if (currentHour >= 6 && currentHour < 11) {
      morningCard.classList.add('is-active');
      if (heroLiveStatusText) {
        heroLiveStatusText.innerHTML = 'Morning Deck Oven Batch #1 &amp; #2 &bull; Hot Croissants &amp; Sourdough &bull; Express Delivery';
      }
    } else if (currentHour >= 11 && currentHour < 15) {
      middayCard.classList.add('is-active');
      if (heroLiveStatusText) {
        heroLiveStatusText.innerHTML = 'Midday Lunch Batch #3 &bull; Warm Brioche Sandwiches &amp; Baguettes &bull; Order Now';
      }
    } else {
      afternoonCard.classList.add('is-active');
      if (heroLiveStatusText) {
        heroLiveStatusText.innerHTML = 'Afternoon Teatime &bull; Celebration Cakes &amp; Chilled Cold Brews &bull; Ready to Dispatch';
      }
    }

    // Allow user to click schedule cards to inspect batches
    [morningCard, middayCard, afternoonCard].forEach(card => {
      card.addEventListener('click', () => {
        [morningCard, middayCard, afternoonCard].forEach(c => c.classList.remove('is-active'));
        card.classList.add('is-active');
      });
    });
  }

  // 2. Hero Interactive Floating Quick Add Buttons
  document.querySelectorAll('.hero-quick-add-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const id = btn.dataset.id;
      const name = btn.dataset.name;
      const price = parseFloat(btn.dataset.price) || 2.50;
      const img = btn.dataset.img;
      const cat = btn.dataset.cat || 'bakery';

      const originalText = btn.innerHTML;
      btn.disabled = true;
      btn.innerHTML = 'Adding...';

      setTimeout(() => {
        addProductToCart({
          name,
          price,
          image: img,
          category: cat
        }, 1);

        btn.disabled = false;
        btn.innerHTML = 'Added ✓';
        btn.style.background = 'var(--coral)';
        btn.style.color = '#ffffff';

        setTimeout(() => {
          btn.innerHTML = originalText;
          btn.style.background = '';
          btn.style.color = '';
        }, 1400);
      }, 200);
    });
  });

  // 3. Daily Offer Banner Quick Add Buttons
  document.querySelectorAll('.offer-slide').forEach((slide, idx) => {
    const combo = DAILY_SETS[idx];
    if (!combo) return;

    let addBtn = slide.querySelector('.add-combo-btn');
    if (addBtn) {
      addBtn.addEventListener('click', (e) => {
        e.preventDefault();
        const originalText = addBtn.innerHTML;
        addBtn.disabled = true;
        addBtn.innerHTML = `<span>Adding ${combo.name}...</span>`;

        setTimeout(() => {
          addProductToCart({
            name: combo.name,
            price: combo.price,
            image: combo.image,
            category: 'combo'
          }, 1, {
            size: combo.items.join(' + ')
          });

          addBtn.disabled = false;
          addBtn.innerHTML = `<span>Added to basket ✓</span>`;
          setTimeout(() => {
            addBtn.innerHTML = originalText;
          }, 1600);
        }, 250);
      });
    }
  });

  // 4. Modal Setup for Product Customization
  const modal = document.getElementById('product-modal');
  const modalClose = modal?.querySelector('.modal-close');
  const modalImg = document.getElementById('modal-image');
  const modalName = document.getElementById('modal-name');
  const modalDesc = document.getElementById('modal-description');
  const modalPrice = document.getElementById('modal-price');
  const modalQty = document.getElementById('modal-quantity');
  const modalMinus = document.getElementById('quantity-minus');
  const modalPlus = document.getElementById('quantity-plus');
  const modalAdd = document.getElementById('modal-add');
  const modalFieldset = modal?.querySelector('.modal-options fieldset');

  let activeProduct = null;
  let activeSelectedOption = null;

  function openCustomizer(product) {
    if (!modal) return;
    activeProduct = product;
    activeSelectedOption = product.sizes ? product.sizes[0] : { label: 'Standard', priceMultiplier: 1.0, value: 'Standard' };

    if (modalImg) modalImg.src = product.image;
    if (modalName) modalName.textContent = product.name;
    if (modalDesc) modalDesc.textContent = product.description;
    if (modalQty) modalQty.value = 1;

    // Render options
    if (modalFieldset) {
      if (product.sizes && product.sizes.length > 0) {
        modalFieldset.style.display = 'block';
        modalFieldset.innerHTML = `
          <legend>Select Option / Size</legend>
          ${product.sizes.map((size, index) => {
            const sizePrice = (product.price * size.priceMultiplier).toFixed(2);
            return `
              <label class="size-option-label">
                <span>
                  <input type="radio" name="modal-size-opt" value="${size.value}" data-multiplier="${size.priceMultiplier}" ${index === 0 ? 'checked' : ''}>
                  <strong>${size.label}</strong>
                </span>
                <span class="opt-price">$${sizePrice}</span>
              </label>
            `;
          }).join('')}
        `;

        modalFieldset.querySelectorAll('input[type="radio"]').forEach(radio => {
          radio.addEventListener('change', () => {
            const mult = parseFloat(radio.dataset.multiplier) || 1.0;
            activeSelectedOption = {
              label: radio.value,
              value: radio.value,
              priceMultiplier: mult
            };
            updateModalPrice();
          });
        });
      } else {
        modalFieldset.style.display = 'none';
      }
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

  function updateModalPrice() {
    if (!activeProduct) return;
    const qty = Math.max(1, parseInt(modalQty?.value || '1', 10));
    const mult = activeSelectedOption ? activeSelectedOption.priceMultiplier : 1.0;
    const unitPrice = activeProduct.price * mult;
    const total = (unitPrice * qty).toFixed(2);
    if (modalPrice) modalPrice.textContent = `$${total}`;
  }

  if (modalClose) {
    modalClose.addEventListener('click', closeModal);
  }

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

  modalMinus?.addEventListener('click', () => {
    if (!modalQty) return;
    let val = parseInt(modalQty.value, 10) || 1;
    val = Math.max(1, val - 1);
    modalQty.value = val;
    updateModalPrice();
  });

  modalPlus?.addEventListener('click', () => {
    if (!modalQty) return;
    let val = parseInt(modalQty.value, 10) || 1;
    val = Math.min(20, val + 1);
    modalQty.value = val;
    updateModalPrice();
  });

  modalQty?.addEventListener('input', updateModalPrice);

  modalAdd?.addEventListener('click', () => {
    if (!activeProduct) return;
    const qty = Math.max(1, parseInt(modalQty?.value || '1', 10));
    const mult = activeSelectedOption ? activeSelectedOption.priceMultiplier : 1.0;
    const unitPrice = activeProduct.price * mult;

    addProductToCart({
      name: activeProduct.name,
      price: unitPrice,
      image: activeProduct.image,
      category: activeProduct.category
    }, qty, {
      size: activeSelectedOption?.value || 'Standard'
    });

    closeModal();
  });

  // 5. Popular Bakery Items with Rich Controls & Filter Chips
  const popularContainer = document.querySelector('.bakery-grid');
  const popularFilterChips = document.querySelectorAll('.popular-filter-chip');

  function renderFeaturedItems(filter = 'all') {
    if (!popularContainer) return;

    let items = PRODUCTS.filter(p => {
      if (filter === 'all') {
        return ['croissant-classic', 'chocolate-strawberry-cake', 'artisan-baguette', 'iced-mondulkiri-coffee', 'tuna-avocado-sandwich', 'stracciatella-maqui-cheesecake', 'ham-gruyere-croissant', 'matcha-latte'].includes(p.id);
      }
      if (filter === 'bread') return p.category === 'bread' || p.category === 'pastry';
      return p.category === filter;
    });

    if (items.length === 0) {
      items = PRODUCTS.slice(0, 4);
    }

    const currentFavs = readJson(FAVORITES_KEY, []);

    popularContainer.innerHTML = items.map((product) => {
      const isFav = currentFavs.includes(product.name);
      const badgeHtml = product.badge ? `<span class="promo-badge-ribbon">${product.badge}</span>` : '';
      const dietaryHtml = (product.dietary || []).map(d => `<span class="tax-tag">${d}</span>`).join(' &bull; ');

      return `
        <article class="bakery-item reveal-on-scroll is-visible" data-id="${product.id}" data-product="${product.name}" data-price="${product.price.toFixed(2)}">
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
            <small>${product.description.slice(0, 72)}...</small>
            <div class="price-row">
              <b class="price-val">$${product.price.toFixed(2)}</b>
              ${dietaryHtml ? `<span class="tax-tag">${dietaryHtml}</span>` : '<span class="tax-tag">Freshly baked</span>'}
            </div>
          </div>
          <div class="card-actions">
            <div class="stepper-wrap">
              <button type="button" class="home-qty-btn" data-step="-1" aria-label="Decrease quantity">&#8722;</button>
              <input class="quantity" type="number" min="1" max="10" value="1" aria-label="${product.name} quantity">
              <button type="button" class="home-qty-btn" data-step="1" aria-label="Increase quantity">&#43;</button>
            </div>
            <button class="home-add-btn add-button" type="button">
              <span>Add to order</span>
            </button>
            <button class="home-qty-btn customize-btn" type="button" aria-label="Customise ${product.name}" title="Options & Sizing">⚙</button>
          </div>
        </article>
      `;
    }).join('');

    bindPopularItemEvents();
  }

  function bindPopularItemEvents() {
    if (!popularContainer) return;

    popularContainer.querySelectorAll('.bakery-item').forEach((card) => {
      const id = card.dataset.id;
      const product = PRODUCTS.find(p => p.id === id) || {
        id,
        name: card.dataset.product,
        price: parseFloat(card.dataset.price) || 2.50,
        image: card.querySelector('img')?.src || 'images/logo.png',
        category: card.querySelector('.item-category-label')?.textContent || 'bakery',
        description: card.querySelector('.item-info small')?.textContent || ''
      };

      const name = product.name;
      const price = product.price;
      const img = product.image;
      const cat = product.category;

      // Favorite toggle
      const favBtn = card.querySelector('.favorite-button');
      favBtn?.addEventListener('click', (e) => {
        e.stopPropagation();
        const favList = readJson(FAVORITES_KEY, []);
        const idx = favList.indexOf(name);
        if (idx >= 0) {
          favList.splice(idx, 1);
          favBtn.classList.remove('is-favorite');
          favBtn.innerHTML = '&#9825;';
          favBtn.setAttribute('aria-label', `Add ${name} to favorites`);
          showToast(`Removed ${name} from favorites`, 'info');
        } else {
          favList.push(name);
          favBtn.classList.add('is-favorite');
          favBtn.innerHTML = '&#9829;';
          favBtn.setAttribute('aria-label', `Remove ${name} from favorites`);
          showToast(`Saved ${name} to your favorites!`, 'success');
        }
        writeJson(FAVORITES_KEY, favList);
      });

      // Stepper buttons
      const qtyInput = card.querySelector('.quantity');
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

      // Customize Trigger
      const customizeBtn = card.querySelector('.customize-btn');
      customizeBtn?.addEventListener('click', (e) => {
        e.stopPropagation();
        openCustomizer(product);
      });

      // Add to Cart
      const addBtn = card.querySelector('.add-button');
      addBtn?.addEventListener('click', (e) => {
        e.stopPropagation();
        const qty = Math.max(1, Math.min(20, Number(qtyInput?.value) || 1));
        const originalHtml = addBtn.innerHTML;
        addBtn.disabled = true;
        addBtn.innerHTML = '<span>Adding...</span>';

        setTimeout(() => {
          addProductToCart({
            name,
            price,
            image: img,
            category: cat
          }, qty);

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
    });
  }

  // Filter chips click handling
  popularFilterChips.forEach(chip => {
    chip.addEventListener('click', () => {
      popularFilterChips.forEach(c => c.classList.remove('is-active'));
      chip.classList.add('is-active');
      renderFeaturedItems(chip.dataset.filter);
    });
  });

  // Initial render of featured bakery items
  renderFeaturedItems('all');

  // 6. Newsletter Subscription Form Handler
  const newsletterForm = document.getElementById('footer-newsletter-form');
  const newsletterEmail = document.getElementById('footer-newsletter-email');
  const newsletterMsg = document.getElementById('newsletter-status-msg');

  if (newsletterForm) {
    newsletterForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const email = newsletterEmail?.value.trim();
      if (!email || !email.includes('@')) {
        if (newsletterMsg) {
          newsletterMsg.textContent = 'Please enter a valid email address.';
          newsletterMsg.style.color = 'var(--coral)';
        }
        return;
      }

      if (newsletterMsg) {
        newsletterMsg.textContent = 'Thank you! Welcome to the Cakery Circle ✨';
        newsletterMsg.style.color = '#15803d';
      }
      showToast('Welcome to the Cakery Circle! Check your inbox for 10% off code.', 'success');
      newsletterForm.reset();
    });
  }

  // 7. Back to Top Button
  const backToTopBtn = document.getElementById('back-to-top-btn');
  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }
});
