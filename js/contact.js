const feedbackForm = document.querySelector('.feedback-form');
const status = document.querySelector('.form-status');
feedbackForm?.addEventListener('submit', (event) => {
  event.preventDefault();
  const button = feedbackForm.querySelector('button');
  button.disabled = true;
  button.textContent = 'Sending...';
  window.setTimeout(() => {
    feedbackForm.reset();
    button.disabled = false;
    button.textContent = 'Send feedback';
    status.textContent = 'Message sent. We will get back to you soon.';
    status.classList.add('is-success');
  }, 650);
});
