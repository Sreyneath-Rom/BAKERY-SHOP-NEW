(() => {
  const slideshow = document.querySelector('.offer-slideshow');
  if (!slideshow) return;

  const slides = [...slideshow.querySelectorAll('.offer-slide')];
  const dots = [...slideshow.querySelectorAll('.offer-dot')];
  const prevBtn = slideshow.querySelector('.offer-prev');
  const nextBtn = slideshow.querySelector('.offer-next');
  
  if (slides.length === 0) return;

  let current = 0;
  let timer = null;
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

  function startAutoPlay() {
    stopAutoPlay();
    timer = window.setInterval(() => showSlide(current + 1), 5000);
  }

  function stopAutoPlay() {
    if (timer) {
      clearInterval(timer);
      timer = null;
    }
  }

  function resetAutoPlay() {
    stopAutoPlay();
    startAutoPlay();
  }

  if (prevBtn) {
    prevBtn.addEventListener('click', (e) => {
      e.preventDefault();
      showSlide(current - 1);
      resetAutoPlay();
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', (e) => {
      e.preventDefault();
      showSlide(current + 1);
      resetAutoPlay();
    });
  }

  dots.forEach((dot) => {
    dot.addEventListener('click', (e) => {
      e.preventDefault();
      const targetIndex = Number(dot.dataset.go);
      if (!isNaN(targetIndex)) {
        showSlide(targetIndex);
        resetAutoPlay();
      }
    });
  });

  slideshow.addEventListener('mouseenter', stopAutoPlay);
  slideshow.addEventListener('mouseleave', startAutoPlay);
  slideshow.addEventListener('focusin', stopAutoPlay);
  slideshow.addEventListener('focusout', startAutoPlay);

  slideshow.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowLeft') {
      showSlide(current - 1);
      resetAutoPlay();
    } else if (event.key === 'ArrowRight') {
      showSlide(current + 1);
      resetAutoPlay();
    }
  });

  slideshow.addEventListener('touchstart', (event) => {
    touchStart = event.changedTouches[0].screenX;
  }, { passive: true });

  slideshow.addEventListener('touchend', (event) => {
    const distance = event.changedTouches[0].screenX - touchStart;
    if (Math.abs(distance) > 40) {
      showSlide(current + (distance < 0 ? 1 : -1));
      resetAutoPlay();
    }
  }, { passive: true });

  showSlide(0);
  startAutoPlay();
})();
