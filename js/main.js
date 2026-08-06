/* ==========================================================================
   IDEAL LORY — BAGNO E CASA
   main.js — vanilla JS, nessuna dipendenza esterna
   ========================================================================== */
(function () {
  'use strict';

  var prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ------------------------------------------------------------------
     1. Header: stato "scrolled" (ombra + riduzione altezza)
     ------------------------------------------------------------------ */
  var header = document.querySelector('.site-header');
  if (header) {
    var onScroll = function () {
      if (window.scrollY > 24) {
        header.classList.add('is-scrolled');
      } else {
        header.classList.remove('is-scrolled');
      }
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  /* ------------------------------------------------------------------
     2. Menu mobile (hamburger)
     ------------------------------------------------------------------ */
  var navToggle = document.querySelector('.nav-toggle');
  var navMain = document.querySelector('.nav-main');
  if (navToggle && navMain) {
    navToggle.addEventListener('click', function () {
      var isOpen = navToggle.getAttribute('aria-expanded') === 'true';
      navToggle.setAttribute('aria-expanded', String(!isOpen));
      navMain.classList.toggle('is-open', !isOpen);
      document.body.style.overflow = !isOpen ? 'hidden' : '';
    });

    // Chiude il menu quando si clicca un link (utile su mobile)
    navMain.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        navToggle.setAttribute('aria-expanded', 'false');
        navMain.classList.remove('is-open');
        document.body.style.overflow = '';
      });
    });

    // Chiude con tasto Esc
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && navMain.classList.contains('is-open')) {
        navToggle.setAttribute('aria-expanded', 'false');
        navMain.classList.remove('is-open');
        document.body.style.overflow = '';
        navToggle.focus();
      }
    });
  }

  /* ------------------------------------------------------------------
     3. Scroll reveal — fade-in + slide-up via IntersectionObserver
     ------------------------------------------------------------------ */
  var revealEls = document.querySelectorAll('.reveal');
  if (revealEls.length) {
    if (prefersReducedMotion || !('IntersectionObserver' in window)) {
      revealEls.forEach(function (el) { el.classList.add('is-visible'); });
    } else {
      var io = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting) {
              entry.target.classList.add('is-visible');
              io.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.15, rootMargin: '0px 0px -60px 0px' }
      );
      revealEls.forEach(function (el) { io.observe(el); });
    }
  }

  /* ------------------------------------------------------------------
     4. Hero scroll chevron — scorrimento morbido alla sezione successiva
     ------------------------------------------------------------------ */
  var heroScroll = document.querySelector('.hero-scroll');
  if (heroScroll) {
    heroScroll.addEventListener('click', function () {
      var next = document.querySelector('.hero').nextElementSibling;
      if (next) {
        next.scrollIntoView({ behavior: prefersReducedMotion ? 'auto' : 'smooth' });
      }
    });
  }

  /* ------------------------------------------------------------------
     5. Filtri Portfolio (mostra/nascondi per categoria)
     ------------------------------------------------------------------ */
  var filterBtns = document.querySelectorAll('.filter-btn');
  var galleryCards = document.querySelectorAll('.gallery-card');
  if (filterBtns.length && galleryCards.length) {
    filterBtns.forEach(function (btn) {
      btn.addEventListener('click', function () {
        filterBtns.forEach(function (b) { b.classList.remove('is-active'); b.setAttribute('aria-pressed', 'false'); });
        btn.classList.add('is-active');
        btn.setAttribute('aria-pressed', 'true');
        var filter = btn.getAttribute('data-filter');

        galleryCards.forEach(function (card) {
          var cats = (card.getAttribute('data-category') || '').split(' ');
          var show = filter === 'tutti' || cats.indexOf(filter) !== -1;
          card.style.display = show ? '' : 'none';
        });
      });
    });
  }

  /* ------------------------------------------------------------------
     6. Anno corrente nel footer
     ------------------------------------------------------------------ */
  var yearEl = document.getElementById('current-year');
  if (yearEl) { yearEl.textContent = new Date().getFullYear(); }

  /* ------------------------------------------------------------------
     7. Form contatti — validazione base + invio via mailto (nessun backend)
     ------------------------------------------------------------------ */
  var contactForm = document.getElementById('contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();
      var interventoEl = contactForm.querySelector('#intervento');
      var tempisticaEl = contactForm.querySelector('#tempistica');
      var comuneEl = contactForm.querySelector('#comune');
      var intervento = interventoEl ? interventoEl.value : '';
      var tempistica = tempisticaEl ? tempisticaEl.value : '';
      var comune = comuneEl ? comuneEl.value.trim() : '';
      var name = contactForm.querySelector('#nome').value.trim();
      var phone = contactForm.querySelector('#telefono').value.trim();
      var email = contactForm.querySelector('#email').value.trim();
      var message = contactForm.querySelector('#messaggio').value.trim();
      var feedback = document.getElementById('form-feedback');

      if (!name || !phone || !message) {
        if (feedback) {
          feedback.textContent = 'Per favore compila nome, telefono e messaggio prima di inviare.';
          feedback.classList.add('is-error');
        }
        return;
      }

      var subject = encodeURIComponent('Richiesta preventivo da ' + name);
      var body = encodeURIComponent(
        'Intervento richiesto: ' + (intervento || '-') + '\n' +
        'Tempistica desiderata: ' + (tempistica || '-') + '\n' +
        'Comune: ' + (comune || '-') + '\n\n' +
        'Nome: ' + name + '\n' +
        'Telefono: ' + phone + '\n' +
        'Email: ' + (email || '-') + '\n\n' +
        'Messaggio:\n' + message
      );
      window.location.href = 'mailto:lloredan27@gmail.com?subject=' + subject + '&body=' + body;

      if (feedback) {
        feedback.textContent = 'Si sta aprendo il tuo programma di posta. In alternativa scrivici su WhatsApp al +39 320 892 7857.';
        feedback.classList.remove('is-error');
      }
    });
  }
})();
