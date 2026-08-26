import { getCart, cartCount } from './cart.js';
import { setupCartDrawer } from './cart-ui.js';
import { showToast } from './toast.js';
import { writeJson, readJson, NEWSLETTER_KEY } from './storage.js';

export function initHeaderFooter() {
  const isNested = window.location.pathname.includes('/pages/');

  // 1. Mobile Menu Toggle
  const toggleBtn = document.querySelector('.mobile-toggle-btn');
  const navWrap = document.querySelector('.nav-links-wrap');

  if (toggleBtn && navWrap) {
    toggleBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      const isOpen = navWrap.classList.toggle('is-mobile-open');
      toggleBtn.classList.toggle('is-active', isOpen);
      toggleBtn.setAttribute('aria-expanded', String(isOpen));
    });

    // Close mobile nav when clicking outside
    document.addEventListener('click', (e) => {
      if (navWrap.classList.contains('is-mobile-open') && !navWrap.contains(e.target) && !toggleBtn.contains(e.target)) {
        navWrap.classList.remove('is-mobile-open');
        toggleBtn.classList.remove('is-active');
        toggleBtn.setAttribute('aria-expanded', 'false');
      }
    });

    // Close when clicking a nav link
    navWrap.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navWrap.classList.remove('is-mobile-open');
        toggleBtn.classList.remove('is-active');
        toggleBtn.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // 2. Setup Cart Drawer if element exists
  if (document.querySelector('#order-summary')) {
    setupCartDrawer({ isNestedPage: isNested });
  }

  // 3. Sync Cart Badge Counts
  function updateAllCartCounts() {
    const cart = getCart();
    const totalCount = cartCount(cart);
    const countElements = document.querySelectorAll('#cart-count, .cart-badge-count');
    countElements.forEach(el => {
      el.textContent = totalCount;
      if (totalCount > 0) {
        el.classList.add('has-items');
      } else {
        el.classList.remove('has-items');
      }
    });
  }

  updateAllCartCounts();
  document.addEventListener('cakery-cart-change', updateAllCartCounts);

  // 4. Newsletter Subscription Form
  const newsletterForm = document.querySelector('#footer-newsletter-form');
  const newsletterInput = document.querySelector('#footer-newsletter-email');
  const newsletterMsg = document.querySelector('#newsletter-status-msg');

  if (newsletterForm && newsletterInput) {
    newsletterForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const email = newsletterInput.value.trim();
      if (!email || !email.includes('@') || !email.includes('.')) {
        showToast('Please enter a valid email address', 'info');
        return;
      }

      const subscribers = readJson(NEWSLETTER_KEY, []);
      if (!subscribers.includes(email)) {
        subscribers.push(email);
        writeJson(NEWSLETTER_KEY, subscribers);
      }

      newsletterInput.disabled = true;
      const submitBtn = newsletterForm.querySelector('button');
      const originalText = submitBtn.innerHTML;
      submitBtn.textContent = 'Joining...';

      setTimeout(() => {
        newsletterInput.value = '';
        newsletterInput.disabled = false;
        submitBtn.textContent = 'Welcome! ✨';
        if (newsletterMsg) {
          newsletterMsg.style.display = 'block';
          newsletterMsg.innerHTML = '<strong>✨ Welcome to the Cakery Circle!</strong> Use code <code style="background:rgba(223,104,79,0.15);padding:2px 6px;border-radius:4px;color:#df684f;font-weight:bold;">CAKERY10</code> for 10% off checkout.';
        }
        showToast('Welcome to the Cakery Circle! Coupon code: CAKERY10', 'success', 4000);
        setTimeout(() => {
          submitBtn.innerHTML = originalText;
        }, 4000);
      }, 500);
    });
  }

  // 5. Back to Top Button with smooth scrolling
  const backToTopBtn = document.querySelector('#back-to-top-btn');
  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });

    // Show/hide based on scroll position
    window.addEventListener('scroll', () => {
      if (window.scrollY > 300) {
        backToTopBtn.style.opacity = '1';
        backToTopBtn.style.pointerEvents = 'auto';
      } else {
        backToTopBtn.style.opacity = '0.7';
      }
    }, { passive: true });
  }
}
