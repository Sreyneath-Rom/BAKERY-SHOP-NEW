const slideshow = document.querySelector('.offer-slideshow');
const slides = [...document.querySelectorAll('.offer-slide')];
const dots = [...document.querySelectorAll('.offer-dot')];
let current = 0;
let timer;
let touchStart = 0;

function showSlide(index) {
  current = (index + slides.length) % slides.length;
  slides.forEach((slide, position) => {
    const active = position === current;
    slide.classList.toggle('is-active', active);
    slide.setAttribute('aria-hidden', String(!active));
  });
  dots.forEach((dot, position) => {
    const active = position === current;
    dot.classList.toggle('is-active', active);
    dot.setAttribute('aria-selected', String(active));
  });
}
function startAutoPlay() { window.clearInterval(timer); timer = window.setInterval(() => showSlide(current + 1), 5000); }
function pauseAutoPlay() { window.clearInterval(timer); }
function resetAutoPlay() { pauseAutoPlay(); startAutoPlay(); }

document.querySelector('.offer-prev').addEventListener('click', () => { showSlide(current - 1); resetAutoPlay(); });
document.querySelector('.offer-next').addEventListener('click', () => { showSlide(current + 1); resetAutoPlay(); });
dots.forEach((dot) => dot.addEventListener('click', () => { showSlide(Number(dot.dataset.go)); resetAutoPlay(); }));
slideshow.addEventListener('mouseenter', pauseAutoPlay);
slideshow.addEventListener('mouseleave', startAutoPlay);
slideshow.addEventListener('focusin', pauseAutoPlay);
slideshow.addEventListener('focusout', startAutoPlay);
slideshow.addEventListener('keydown', (event) => {
  if (event.key === 'ArrowLeft') { showSlide(current - 1); resetAutoPlay(); }
  if (event.key === 'ArrowRight') { showSlide(current + 1); resetAutoPlay(); }
});
slideshow.addEventListener('touchstart', (event) => { touchStart = event.changedTouches[0].screenX; }, { passive: true });
slideshow.addEventListener('touchend', (event) => {
  const distance = event.changedTouches[0].screenX - touchStart;
  if (Math.abs(distance) > 45) { showSlide(current + (distance < 0 ? 1 : -1)); resetAutoPlay(); }
}, { passive: true });
showSlide(0);
startAutoPlay();
