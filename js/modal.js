export function closeOnBackdrop(modal) {
  modal?.addEventListener('click', (event) => { if (event.target === modal) modal.classList.remove('is-open'); });
}
