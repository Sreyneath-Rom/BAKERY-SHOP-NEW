export function startLoader() {
  const loader = document.querySelector('.page-loader');
  if (!loader) return;
  window.addEventListener('load', () => window.setTimeout(() => loader.classList.add('is-hidden'), 750), { once: true });
}
