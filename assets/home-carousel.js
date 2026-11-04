// Keep each section's photographs and captions together; the group portrait is fixed.
document.querySelectorAll('.home-carousel').forEach(carousel => {
  const slides = [...carousel.querySelectorAll('.carousel-slide')];
  if (slides.length < 2) return;
  const label = carousel.getAttribute('aria-label');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  let index = 0;
  let paused = reducedMotion.matches;
  let visible = false;
  let request = 0;
  const controls = document.createElement('div');
  controls.className = 'carousel-controls';
  controls.innerHTML = '<button type="button" data-step="-1">‹</button><span class="carousel-count"></span><button type="button" class="carousel-toggle"></button><button type="button" data-step="1">›</button>';
  carousel.append(controls);
  const counter = controls.querySelector('.carousel-count');
  const toggle = controls.querySelector('.carousel-toggle');
  controls.querySelector('[data-step="-1"]').setAttribute('aria-label', label + '：上一张');
  controls.querySelector('[data-step="1"]').setAttribute('aria-label', label + '：下一张');
  const updateControls = () => {
    counter.textContent = `${index + 1} / ${slides.length}`;
    toggle.textContent = paused ? '播放' : '暂停';
    toggle.setAttribute('aria-label', label + (paused ? '：开始自动播放' : '：暂停自动播放'));
  };
  const preloadNext = () => {
    slides[(index + 1) % slides.length].querySelector('img').loading = 'eager';
  };
  const show = async step => {
    const ticket = ++request;
    const next = (index + step + slides.length) % slides.length;
    const img = slides[next].querySelector('img');
    img.loading = 'eager';
    try { await img.decode(); } catch { return; }
    if (ticket !== request) return;
    slides[index].hidden = true;
    slides[next].hidden = false;
    index = next;
    updateControls();
    preloadNext();
  };
  controls.querySelectorAll('[data-step]').forEach(button => {
    button.addEventListener('click', () => {
      paused = true;
      updateControls();
      show(Number(button.dataset.step));
    });
  });
  toggle.addEventListener('click', () => { paused = !paused; updateControls(); });
  // Keyboard users can inspect links without an automatic slide change.
  carousel.addEventListener('focusin', event => {
    if (event.target === toggle) return;
    paused = true;
    updateControls();
  });
  new IntersectionObserver(entries => {
    visible = entries[0].isIntersecting;
    if (visible) preloadNext();
  }).observe(carousel);
  reducedMotion.addEventListener('change', event => {
    if (event.matches) { paused = true; updateControls(); }
  });
  setInterval(() => {
    if (visible && !paused && !document.hidden && !carousel.matches(':hover')) show(1);
  }, 5000);
  updateControls();
});
