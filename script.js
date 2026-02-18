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

  // Bandeau cookies / RGPD (conseil en gestion de patrimoine)
  var banner = document.getElementById('cookie-banner');
  if (banner) {
    var key = 'colinea-cookies-consent';
    var consent = localStorage.getItem(key);
    if (consent === null) {
      banner.setAttribute('aria-hidden', 'false');
      banner.innerHTML =
        '<div class="cookie-banner-inner">' +
        '<p class="cookie-banner-text">Ce site utilise des cookies pour son fonctionnement et votre confort de navigation. Les données collectées via le formulaire de contact sont traitées de manière confidentielle, dans le cadre de notre activité de conseil en gestion de patrimoine. En poursuivant, vous acceptez l’utilisation des cookies. <a href="mentions.html#donnees">En savoir plus</a></p>' +
        '<div class="cookie-banner-actions">' +
        '<button type="button" class="btn btn-primary cookie-accept">Accepter</button>' +
        '<button type="button" class="btn btn-outline cookie-refuse">Refuser</button>' +
        '</div></div>';
      var acceptBtn = banner.querySelector('.cookie-accept');
      var refuseBtn = banner.querySelector('.cookie-refuse');
      function hideBanner(accepted) {
        localStorage.setItem(key, accepted ? 'accepted' : 'refused');
        banner.setAttribute('aria-hidden', 'true');
        banner.classList.remove('cookie-banner-visible');
      }
      if (acceptBtn) acceptBtn.addEventListener('click', function () { hideBanner(true); });
      if (refuseBtn) refuseBtn.addEventListener('click', function () { hideBanner(false); });
      banner.classList.add('cookie-banner-visible');
    }
  }
})();
