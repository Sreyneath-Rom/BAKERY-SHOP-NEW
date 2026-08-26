let toastTimer = null;

export function showToast(message, type = 'success', duration = 2800) {
  let toast = document.querySelector('.order-toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.className = 'order-toast';
    toast.setAttribute('role', 'status');
    toast.setAttribute('aria-live', 'polite');
    document.body.append(toast);
  }

  const icon = type === 'success' ? '✓' : type === 'info' ? 'ℹ' : '★';
  toast.innerHTML = `<span class="toast-icon">${icon}</span> <span class="toast-msg">${message}</span>`;
  toast.dataset.type = type;
  toast.classList.add('is-visible');

  if (toastTimer) {
    clearTimeout(toastTimer);
  }

  toastTimer = window.setTimeout(() => {
    toast.classList.remove('is-visible');
  }, duration);
}
