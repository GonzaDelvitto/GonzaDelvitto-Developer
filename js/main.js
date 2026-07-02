/* =====================================================
   GONZALO DELVITTO — PORTFOLIO
   main.js
   Se encarga de: traer data.json, pintar cada sección,
   animaciones al hacer scroll, menú móvil, efecto de
   escritura del hero y el formulario que arma el link
   de WhatsApp.
===================================================== */

// Íconos usados en las tarjetas de servicios (SVG en línea, sin librerías externas)
const ICONS = {
  landing: '<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="3" y="4" width="18" height="16" rx="2"/><path d="M3 9h18"/><circle cx="6.5" cy="6.5" r=".5" fill="currentColor"/></svg>',
  corporate: '<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M3 21h18M6 21V7l6-4 6 4v14M9 9h1m4 0h1m-6 4h1m4 0h1m-6 4h1m4 0h1"/></svg>',
  ecommerce: '<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="9" cy="20" r="1.4"/><circle cx="18" cy="20" r="1.4"/><path d="M2 3h2l2.4 12.2a2 2 0 0 0 2 1.8h8.7a2 2 0 0 0 2-1.6L21 8H6"/></svg>',
  optimizacion: '<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M13 2 3 14h7l-1 8 10-12h-7z"/></svg>',
  mantenimiento: '<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M14.7 6.3a4 4 0 0 1-5.4 5.4L4 17l3 3 5.3-5.3a4 4 0 0 1 5.4-5.4l-3-3z"/></svg>',
  consultoria: '<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="12" r="9"/><path d="M12 8v4l2.5 2.5"/></svg>'
};

// Fragmentos de "código" que se van tipeando en el mockup del hero
const TERMINAL_SNIPPETS = [
  '<h1>Bienvenido a tu nuevo sitio</h1>',
  'const conversion = leads => ventas;',
  '// optimizado para mobile y SEO',
  'deploy(proyecto).then(exito => 🚀);'
];

document.addEventListener('DOMContentLoaded', () => {
  initPreloader();
  initHeader();
  initMobileNav();
  initBackToTop();
  initYear();
  loadData();
});

/* ---------- Preloader: se oculta apenas termina de cargar la página ---------- */
function initPreloader(){
  const preloader = document.getElementById('preloader');
  if(!preloader) return;
  window.addEventListener('load', () => {
    setTimeout(() => preloader.classList.add('is-hidden'), 350);
  });
}

/* ---------- Header: sombra al scrollear + link activo según la sección visible ---------- */
function initHeader(){
  const header = document.getElementById('header');
  const links = document.querySelectorAll('.nav__link');
  const sections = document.querySelectorAll('main section[id]');

  window.addEventListener('scroll', () => {
    header.classList.toggle('is-scrolled', window.scrollY > 30);
  });

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if(entry.isIntersecting){
        links.forEach(l => l.classList.remove('is-active'));
        const active = document.querySelector(`.nav__link[href="#${entry.target.id}"]`);
        if(active) active.classList.add('is-active');
      }
    });
  }, { rootMargin: '-45% 0px -50% 0px' });

  sections.forEach(s => observer.observe(s));
}

/* ---------- Menú móvil ---------- */
function initMobileNav(){
  const toggle = document.getElementById('navToggle');
  const nav = document.getElementById('nav');
  if(!toggle || !nav) return;

  toggle.addEventListener('click', () => {
    const isOpen = nav.classList.toggle('is-open');
    toggle.setAttribute('aria-expanded', isOpen);
  });

  nav.querySelectorAll('.nav__link').forEach(link => {
    link.addEventListener('click', () => {
      nav.classList.remove('is-open');
      toggle.setAttribute('aria-expanded', 'false');
    });
  });
}

/* ---------- Botón volver arriba ---------- */
function initBackToTop(){
  const btn = document.getElementById('backToTop');
  if(!btn) return;
  window.addEventListener('scroll', () => {
    btn.classList.toggle('is-visible', window.scrollY > 500);
  });
  btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
}

/* ---------- Año automático en el footer ---------- */
function initYear(){
  const el = document.getElementById('year');
  if(el) el.textContent = new Date().getFullYear();
}

/* ---------- Trae data.json y dispara el render de todo el sitio ---------- */
async function loadData(){
  try{
    const res = await fetch('../data/data.json');
    if(!res.ok) throw new Error('No se pudo leer data.json');
    const data = await res.json();

    setupWhatsappLinks(data.perfil);
    renderStats(data.stats);
    renderServices(data.servicios);
    renderProjects(data.proyectos);
    renderProcess(data.proceso);
    renderTimeline(data.formacion);
    renderPricing(data.precios);
    initTerminalTyping();
    initScrollReveal();
    initContactForm(data.perfil);
  }catch(err){
    console.error('Error cargando data.json:', err);
  }
}

/* ---------- Arma todos los links de WhatsApp del sitio a partir del perfil ---------- */
function setupWhatsappLinks(perfil){
  if(!perfil) return;
  const texto = encodeURIComponent(perfil.mensajeWhatsapp || 'Hola, quiero hacerte una consulta.');
  const url = `https://wa.me/${perfil.whatsapp}?text=${texto}`;

  ['navWhatsapp', 'heroWhatsapp', 'contactWhatsapp', 'floatWhatsapp'].forEach(id => {
    const el = document.getElementById(id);
    if(el) el.href = url;
  });

  const disponibilidad = document.getElementById('disponibilidad');
  if(disponibilidad && perfil.disponible === false){
    disponibilidad.querySelector('.eyebrow__dot')?.remove();
    disponibilidad.textContent = 'Actualmente con agenda completa';
  }
}

/* ---------- Estadísticas del hero, con animación de conteo ---------- */
function renderStats(stats = []){
  const list = document.getElementById('statsList');
  if(!list) return;

  list.innerHTML = stats.map((s, i) => `
    <li>
      <span class="stat__number" data-target="${s.numero}" data-suffix="${s.sufijo || ''}">0${s.sufijo || ''}</span>
      <span class="stat__label">${s.etiqueta}</span>
    </li>
  `).join('');

  const numbers = list.querySelectorAll('.stat__number');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if(entry.isIntersecting){
        animateCount(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.6 });
  numbers.forEach(n => observer.observe(n));
}

function animateCount(el){
  const target = parseInt(el.dataset.target, 10);
  const suffix = el.dataset.suffix || '';
  const duration = 1200;
  const start = performance.now();

  function tick(now){
    const progress = Math.min((now - start) / duration, 1);
    const value = Math.floor(progress * target);
    el.textContent = value + suffix;
    if(progress < 1) requestAnimationFrame(tick);
    else el.textContent = target + suffix;
  }
  requestAnimationFrame(tick);
}

/* ---------- Servicios ---------- */
function renderServices(servicios = []){
  const grid = document.getElementById('servicesGrid');
  if(!grid) return;

  grid.innerHTML = servicios.map(s => `
    <article class="service-card reveal">
      <div class="service-card__icon">${ICONS[s.icono] || ''}</div>
      <h3 class="service-card__title">${s.titulo}</h3>
      <p class="service-card__desc">${s.descripcion}</p>
      <div class="service-card__tags">
        ${s.tags.map(t => `<span class="tag">${t}</span>`).join('')}
      </div>
    </article>
  `).join('');
}

/* ---------- Proyectos ---------- */
function renderProjects(proyectos = []){
  const grid = document.getElementById('projectsGrid');
  if(!grid) return;

  grid.innerHTML = proyectos.map(p => `
    <article class="project-card reveal">
      <a class="project-card__media" href="${p.link}" target="_blank" rel="noopener">
        <span class="project-card__category">${p.categoria}</span>
        <img src="${p.img}" alt="Captura del proyecto ${p.titulo}" loading="lazy" onerror="this.remove()">
      </a>
      <div class="project-card__body">
        <h3 class="project-card__title">${p.titulo}</h3>
        <p class="project-card__desc">${p.descripcion}</p>
        <div class="project-card__tech">
          ${p.tecnologias.map(t => `<span class="tag">${t}</span>`).join('')}
        </div>
      </div>
    </article>
  `).join('');
}

/* ---------- Proceso ---------- */
function renderProcess(pasos = []){
  const grid = document.getElementById('processGrid');
  if(!grid) return;

  grid.innerHTML = pasos.map(p => `
    <div class="process-step reveal">
      <span class="process-step__number">${p.numero}</span>
      <h3 class="process-step__title">${p.titulo}</h3>
      <p class="process-step__desc">${p.descripcion}</p>
    </div>
  `).join('');
}

/* ---------- Formación: línea de tiempo de carreras y cursos ---------- */
function renderTimeline(items = []){
  const list = document.getElementById('timelineList');
  if(!list) return;

  list.innerHTML = items.map(item => `
    <div class="timeline-item reveal" data-tipo="${item.tipo}">
      <span class="timeline-item__period">${item.periodo}<span class="timeline-item__badge">${item.tipo === 'carrera' ? 'Carrera' : 'Curso'}</span></span>
      <h3 class="timeline-item__title">${item.titulo}</h3>
      <span class="timeline-item__institution">${item.institucion}</span>
      <p class="timeline-item__desc">${item.descripcion}</p>
    </div>
  `).join('');
}

/* ---------- Precios ---------- */
function renderPricing(planes = []){
  const grid = document.getElementById('pricingGrid');
  if(!grid) return;

  grid.innerHTML = planes.map(plan => `
    <div class="pricing-card reveal ${plan.destacado ? 'pricing-card--featured' : ''}">
      <h3 class="pricing-card__name">${plan.nombre}</h3>
      <p class="pricing-card__desc">${plan.descripcion}</p>
      <ul class="pricing-card__features">
        ${plan.caracteristicas.map(c => `<li>${c}</li>`).join('')}
      </ul>
      <a href="#contacto" class="btn ${plan.destacado ? 'btn--primary' : 'btn--outline'}">Consultar</a>
    </div>
  `).join('');
}

/* ---------- Efecto de escritura del terminal en el hero ---------- */
function initTerminalTyping(){
  const el = document.getElementById('terminalCode');
  if(!el) return;

  if(window.matchMedia('(prefers-reduced-motion: reduce)').matches){
    el.textContent = TERMINAL_SNIPPETS.join('\n');
    return;
  }

  let snippetIndex = 0;
  let charIndex = 0;
  let currentText = '';
  let deleting = false;

  function tick(){
    const snippet = TERMINAL_SNIPPETS[snippetIndex];

    if(!deleting){
      charIndex++;
      currentText = snippet.slice(0, charIndex);
      if(charIndex === snippet.length){
        deleting = true;
        setTimeout(tick, 1400);
        el.textContent = buildTerminalOutput();
        return;
      }
    }else{
      charIndex--;
      currentText = snippet.slice(0, charIndex);
      if(charIndex === 0){
        deleting = false;
        snippetIndex = (snippetIndex + 1) % TERMINAL_SNIPPETS.length;
      }
    }

    el.textContent = buildTerminalOutput();
    setTimeout(tick, deleting ? 22 : 42);
  }

  function buildTerminalOutput(){
    const previous = TERMINAL_SNIPPETS.slice(0, snippetIndex).join('\n');
    return previous + (previous ? '\n' : '') + currentText;
  }

  tick();
}

/* ---------- Revela con fade+slide los bloques marcados con .reveal ---------- */
function initScrollReveal(){
  const items = document.querySelectorAll('.reveal');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if(entry.isIntersecting){
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  items.forEach(item => observer.observe(item));
}

/* ---------- Formulario de contacto: arma el link de WhatsApp con lo que escribió el usuario ---------- */
function initContactForm(perfil){
  const form = document.getElementById('contactForm');
  if(!form || !perfil) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const nombre = form.fName.value.trim();
    const contactoDato = form.fContact.value.trim();
    const mensaje = form.fMsg.value.trim();

    const texto = `Hola Gonzalo, soy ${nombre}.\n${mensaje}\n\nMi contacto: ${contactoDato}`;
    const url = `https://wa.me/${perfil.whatsapp}?text=${encodeURIComponent(texto)}`;

    window.open(url, '_blank', 'noopener');
    form.reset();
  });
}
