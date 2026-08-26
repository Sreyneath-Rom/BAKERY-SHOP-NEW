export function startRevealAnimations() {
  const elements = document.querySelectorAll('.reveal-on-scroll');
  if (elements.length) {
    if (!('IntersectionObserver' in window)) {
      elements.forEach((element) => element.classList.add('is-visible'));
    } else {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add('is-visible');
              observer.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.08, rootMargin: '0px 0px -20px 0px' }
      );

      elements.forEach((element) => observer.observe(element));
    }
  }

  initLazyImages();
}

export function initLazyImages() {
  const lazyImages = document.querySelectorAll('img[loading="lazy"]');
  lazyImages.forEach((img) => {
    if (img.complete) {
      img.classList.add('is-loaded');
    } else {
      img.addEventListener('load', () => {
        img.classList.add('is-loaded');
      }, { once: true });
      img.addEventListener('error', () => {
        img.classList.add('is-loaded');
      }, { once: true });
    }
  });
}
