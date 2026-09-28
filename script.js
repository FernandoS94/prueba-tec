// ===== Acordeón FAQ =====
document.querySelectorAll('.accordion-trigger').forEach((btn) => {
  btn.addEventListener('click', () => {
    const panel = btn.nextElementSibling;
    const isOpen = btn.getAttribute('aria-expanded') === 'true';

    // Cierra los demás (comportamiento tipo acordeón simple)
    document.querySelectorAll('.accordion-trigger').forEach((otherBtn) => {
      if (otherBtn !== btn) {
        otherBtn.setAttribute('aria-expanded', 'false');
        otherBtn.nextElementSibling.style.maxHeight = null;
      }
    });

    if (isOpen) {
      btn.setAttribute('aria-expanded', 'false');
      panel.style.maxHeight = null;
    } else {
      btn.setAttribute('aria-expanded', 'true');
      panel.style.maxHeight = panel.scrollHeight + 'px';
    }
  });
});

// ===== Cuenta regresiva =====
// 30 de octubre de 2026, 8:00 h, horario de Buenos Aires (UTC-3)
const EVENT_DATE = new Date('2026-10-30T08:00:00-03:00');

// Guarda el último valor mostrado de cada unidad para saber cuándo animarla
const lastCountdownValues = { days: null, hours: null, minutes: null, seconds: null };

function setCountdownField(id, value, key) {
  const el = document.getElementById(id);
  if (!el) return;

  el.textContent = value;

  if (lastCountdownValues[key] !== null && lastCountdownValues[key] !== value) {
    // Reinicia la animación aunque el valor cambie dos veces seguidas rápido
    el.classList.remove('is-tick');
    void el.offsetWidth; // fuerza reflow
    el.classList.add('is-tick');
  }
  lastCountdownValues[key] = value;
}

function updateCountdown() {
  const el = document.getElementById('countdown');
  if (!el) return;

  const now = new Date();
  const diff = EVENT_DATE - now;

  if (diff <= 0) {
    el.classList.add('is-finished');
    setCountdownField('cd-days', '00', 'days');
    setCountdownField('cd-hours', '00', 'hours');
    setCountdownField('cd-minutes', '00', 'minutes');
    setCountdownField('cd-seconds', '00', 'seconds');
    return;
  }

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((diff / (1000 * 60)) % 60);
  const seconds = Math.floor((diff / 1000) % 60);

  const pad = (n) => String(n).padStart(2, '0');

  setCountdownField('cd-days', pad(days), 'days');
  setCountdownField('cd-hours', pad(hours), 'hours');
  setCountdownField('cd-minutes', pad(minutes), 'minutes');
  setCountdownField('cd-seconds', pad(seconds), 'seconds');
}

updateCountdown();
setInterval(updateCountdown, 1000);

// ===== Carrusel Premium TECWeek =====

(() => {

  const track = document.getElementById('expTrack');
  if (!track) return;

  const slides = Array.from(track.children);
  const dots = Array.from(document.querySelectorAll('[data-exp-dot]'));

  const prevBtn = document.querySelector('[data-exp-prev]');
  const nextBtn = document.querySelector('[data-exp-next]');

  const progress = document.getElementById('expProgress');
  const section = document.querySelector('.experiencias');

  let current = 0;
  let autoplay;

  const fondos = [
    '#EEF7E9',
    '#F1EEFF',
    '#EAF9F8',
    '#FFF3EA',
    '#FCEEF5'
  ];

  function updateUI(index){

    slides.forEach((slide,i)=>{
      slide.classList.toggle('is-active',i===index);
    });

    dots.forEach((dot,i)=>{
      const active = i===index;
      dot.classList.toggle('is-active',active);
      dot.setAttribute('aria-selected',active);
    });

    if(progress){
      progress.style.width =
        `${((index+1)/slides.length)*100}%`;
    }

    section.style.background =
      fondos[index] || '#F3F1EA';
  }

  // Posición que deja al slide centrado dentro del track (usa medidas reales, no estimaciones)
  function centerLeft(i){
    const slide = slides[i];
    return slide.offsetLeft - (track.clientWidth - slide.offsetWidth) / 2;
  }

  function goTo(index,behavior='smooth'){

    current =
      (index + slides.length) %
      slides.length;

    track.scrollTo({
      left: centerLeft(current),
      behavior
    });

    updateUI(current);
  }

  prevBtn?.addEventListener(
    'click',
    ()=>goTo(current-1)
  );

  nextBtn?.addEventListener(
    'click',
    ()=>goTo(current+1)
  );

  dots.forEach((dot,i)=>{
    dot.addEventListener(
      'click',
      ()=>goTo(i)
    );
  });

  track.addEventListener('keydown',(e)=>{

    if(e.key==='ArrowRight'){
      e.preventDefault();
      goTo(current+1);
    }

    if(e.key==='ArrowLeft'){
      e.preventDefault();
      goTo(current-1);
    }

  });

  let scrollTimeout;

  track.addEventListener('scroll',()=>{

    clearTimeout(scrollTimeout);

    scrollTimeout = setTimeout(()=>{

      // Slide cuyo centro queda más cerca del centro visible del track
      const viewCenter = track.scrollLeft + track.clientWidth / 2;
      let nearest = 0;
      let best = Infinity;

      slides.forEach((slide,i)=>{
        const d = Math.abs(
          slide.offsetLeft + slide.offsetWidth / 2 - viewCenter
        );
        if (d < best) { best = d; nearest = i; }
      });

      current = nearest;
      updateUI(current);

    },100);

  });

  function startAutoplay(){

    autoplay = setInterval(()=>{
      goTo(current + 1);
    },5000);

  }

  function stopAutoplay(){
    clearInterval(autoplay);
  }

  track.addEventListener(
    'mouseenter',
    stopAutoplay
  );

  track.addEventListener(
    'mouseleave',
    startAutoplay
  );

  window.addEventListener(
    'resize',
    ()=>goTo(current,'auto')
  );

  updateUI(0);
  startAutoplay();

})();

// ===== Menú mobile =====
const navToggle = document.getElementById('navToggle');
const mainNav = document.getElementById('mainNav');

if (navToggle && mainNav) {
  navToggle.addEventListener('click', () => {
    const isOpen = mainNav.classList.toggle('is-open');
    navToggle.setAttribute('aria-expanded', String(isOpen));
  });

  mainNav.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      mainNav.classList.remove('is-open');
      navToggle.setAttribute('aria-expanded', 'false');
    });
  });
}
