(function () {
  'use strict';

  // Menu mobile
  var navToggle = document.querySelector('.nav-toggle');
  var nav = document.querySelector('.nav');

  if (navToggle && nav) {
    navToggle.addEventListener('click', function () {
      var isOpen = navToggle.getAttribute('aria-expanded') === 'true';
      navToggle.setAttribute('aria-expanded', !isOpen);
      nav.classList.toggle('is-open');
      document.body.style.overflow = isOpen ? '' : 'hidden';
    });

    // Fermer le menu au clic sur un lien
    nav.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        navToggle.setAttribute('aria-expanded', 'false');
        nav.classList.remove('is-open');
        document.body.style.overflow = '';
      });
    });
  }

  // Header au scroll (optionnel : fond plus marqué après scroll)
  var header = document.getElementById('header');
  if (header) {
    function updateHeader() {
      if (window.scrollY > 50) {
        header.style.background = 'rgba(15, 18, 22, 0.95)';
      } else {
        header.style.background = 'rgba(15, 18, 22, 0.85)';
      }
    }
    window.addEventListener('scroll', updateHeader, { passive: true });
    updateHeader();
  }

  // Pas de logique JS sur le formulaire :
  // Netlify gère directement l'envoi et la redirection.
})();
