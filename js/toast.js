export function showToast(message, type = 'success') {
  let toast = document.querySelector('.order-toast');
  if (!toast) { toast = document.createElement('div'); toast.className = 'order-toast'; toast.setAttribute('role', 'status'); document.body.append(toast); }
  toast.dataset.type = type; toast.textContent = message; toast.classList.add('is-visible');
  window.setTimeout(() => toast.classList.remove('is-visible'), 2400);
}
