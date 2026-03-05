(function () {
  'use strict';

  var WHATSAPP_NUMBER = '5547999999999';
  var DEFAULT_MESSAGE = 'Olá, vim pelo site e gostaria de falar com um advogado.';

  function sendToWhatsApp(message) {
    var text = typeof message === 'string' && message.trim() ? message.trim() : DEFAULT_MESSAGE;
    var url = 'https://wa.me/' + WHATSAPP_NUMBER + '?text=' + encodeURIComponent(text);
    window.open(url, '_blank', 'noopener,noreferrer');
  }

  window.sendToWhatsApp = sendToWhatsApp;

  var header = document.getElementById('header');
  var nav = document.getElementById('nav');
  var navToggle = document.getElementById('navToggle');

  if (navToggle && nav) {
    navToggle.addEventListener('click', function () {
      var expanded = navToggle.getAttribute('aria-expanded') === 'true';
      navToggle.setAttribute('aria-expanded', !expanded);
      nav.classList.toggle('is-open');
      document.body.style.overflow = expanded ? '' : 'hidden';
    });
  }

  document.querySelectorAll('.nav-link').forEach(function (link) {
    link.addEventListener('click', function () {
      if (nav && nav.classList.contains('is-open')) {
        nav.classList.remove('is-open');
        if (navToggle) navToggle.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      }
    });
  });

  var scrollRevealEls = document.querySelectorAll('.scroll-reveal');
  var observerOptions = { root: null, rootMargin: '0px', threshold: 0.1 };

  function reveal(entries, observer) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        observer.unobserve(entry.target);
      }
    });
  }

  if (typeof IntersectionObserver !== 'undefined') {
    var observer = new IntersectionObserver(reveal, observerOptions);
    scrollRevealEls.forEach(function (el) {
      observer.observe(el);
    });
  } else {
    scrollRevealEls.forEach(function (el) {
      el.classList.add('revealed');
    });
  }

  var statNumbers = document.querySelectorAll('.stat-number[data-target]');
  function animateValue(el, target, duration) {
    var start = 0;
    var startTime = null;
    target = parseInt(target, 10);
    if (isNaN(target)) return;

    function step(timestamp) {
      if (!startTime) startTime = timestamp;
      var progress = Math.min((timestamp - startTime) / duration, 1);
      var easeOut = 1 - Math.pow(1 - progress, 3);
      var current = Math.floor(start + (target - start) * easeOut);
      el.textContent = current.toLocaleString('pt-BR');
      if (progress < 1) {
        window.requestAnimationFrame(step);
      } else {
        el.textContent = target.toLocaleString('pt-BR');
      }
    }

    window.requestAnimationFrame(step);
  }

  var statsObserver = typeof IntersectionObserver !== 'undefined' ? new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        var el = entry.target;
        var target = el.getAttribute('data-target');
        if (target) {
          animateValue(el, target, 1500);
          statsObserver.unobserve(el);
        }
      }
    });
  }, { threshold: 0.5 }) : null;

  if (statsObserver) {
    statNumbers.forEach(function (el) {
      statsObserver.observe(el);
    });
  }

  var yearEl = document.getElementById('year');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

  var form = document.getElementById('formConsulta');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var submitBtn = form.querySelector('button[type="submit"]');
      var formData = new FormData(form);
      var action = form.getAttribute('action');
      if (!action) return;
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = 'Enviando...';
      }
      fetch(action, {
        method: 'POST',
        body: formData
      })
        .then(function (res) {
          return res.json().then(function (data) {
            return { ok: res.ok, data: data };
          }).catch(function () {
            return { ok: false, data: { message: 'Resposta inválida do servidor.' } };
          });
        })
        .then(function (result) {
          if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.textContent = 'Solicitar análise do caso';
          }
          if (result.ok && result.data.success) {
            form.reset();
            alert(result.data.message || 'Solicitação enviada com sucesso!');
          } else {
            alert(result.data.message || 'Erro ao enviar. Tente novamente ou fale pelo WhatsApp.');
          }
        })
        .catch(function () {
          if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.textContent = 'Solicitar análise do caso';
          }
          alert('Erro de conexão. Tente novamente ou fale pelo WhatsApp.');
        });
    });
  }
})();
