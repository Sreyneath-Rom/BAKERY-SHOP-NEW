export function startLoader() {
  const loader = document.querySelector('.page-loader');
  if (!loader) return;

  const hideLoader = () => {
    window.setTimeout(() => {
      loader.classList.add('is-hidden');
      window.setTimeout(() => {
        loader.style.display = 'none';
        loader.setAttribute('aria-hidden', 'true');
      }, 400);
    }, 450);
  };

  if (document.readyState === 'complete') {
    hideLoader();
  } else {
    window.addEventListener('load', hideLoader, { once: true });
    // Safety fallback in case the load event already fired or is stalled by an external asset
    window.setTimeout(hideLoader, 2500);
  }
}
