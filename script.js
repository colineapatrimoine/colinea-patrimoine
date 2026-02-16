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

  // Formulaire de contact
  var form = document.querySelector('.contact-form');
  if (form) {
    form.addEventListener('submit', function (e) {
      // Si le formulaire est géré par Netlify (data-netlify="true"),
      // on laisse l'envoi normal vers Netlify.
      if (form.hasAttribute('data-netlify')) {
        return;
      }

      e.preventDefault();
      // Par défaut : ouvre le logiciel d'email du visiteur
      // avec un message prérempli adressé à colineapatrimoine@gmail.com.
      var nameInput = form.querySelector('#name');
      var emailInput = form.querySelector('#email');
      var messageInput = form.querySelector('#message');

      var name = nameInput ? nameInput.value.trim() : '';
      var email = emailInput ? emailInput.value.trim() : '';
      var message = messageInput ? messageInput.value.trim() : '';

      var subject = 'Contact site Colinéa Patrimoine';
      var bodyLines = [];
      if (name) bodyLines.push('Nom : ' + name);
      if (email) bodyLines.push('Email : ' + email);
      if (message) {
        bodyLines.push('');
        bodyLines.push('Message :');
        bodyLines.push(message);
      }

      var body = encodeURIComponent(bodyLines.join('\n'));
      var mailto = 'mailto:colineapatrimoine@gmail.com'
        + '?subject=' + encodeURIComponent(subject)
        + '&body=' + body;

      window.location.href = mailto;
    });
  }
})();
