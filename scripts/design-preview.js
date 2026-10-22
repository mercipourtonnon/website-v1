// design/site/preview.js — copied by scripts/export-design.sh into the
// mirrored site and linked from every page by relativize-design.py.
//
// The mirrored site is static: there is no Sovrium server behind it. What
// runs in the browser (menus, FAQ toggles, the command palette, scroll
// animations, form validation) works as is; what needs the server (sending a
// form, signing in or up, the private /espace pages) is answered here with a
// short notice instead of a failed request or a redirect to nowhere.
(function () {
  'use strict';

  var NOTICE_ID = 'apercu-hors-ligne';

  function notice(text) {
    var el = document.getElementById(NOTICE_ID);
    if (!el) {
      el = document.createElement('div');
      el.id = NOTICE_ID;
      el.setAttribute('role', 'status');
      el.setAttribute('aria-live', 'polite');
      el.style.cssText = [
        'position:fixed', 'left:50%', 'bottom:16px', 'transform:translateX(-50%)',
        'z-index:2147483647', 'max-width:min(92vw,520px)', 'padding:12px 16px',
        'border-radius:12px', 'background:#1d1d3b', 'color:#fff',
        'font:500 14px/1.45 system-ui,sans-serif', 'box-shadow:0 8px 24px rgba(0,0,0,.25)',
        'transition:opacity .2s', 'opacity:0'
      ].join(';');
      (document.body || document.documentElement).appendChild(el);
    }
    el.textContent = text;
    el.style.opacity = '1';
    clearTimeout(el._t);
    el._t = setTimeout(function () { el.style.opacity = '0'; }, 4200);
  }

  var OFFLINE = 'Aperçu hors ligne : sans serveur, ce formulaire n’envoie rien. Sur mercipourtonnon.fr, il fonctionne.';
  var PRIVATE = 'L’espace bénévole demande une connexion : il n’est pas inclus dans cet aperçu.';

  function isApi(url) {
    try { return new URL(url, location.href).pathname.indexOf('/api/') !== -1; } catch (e) { return false; }
  }

  // API calls (auth, record writes, search) answer a clean 503 instead of a
  // 404 from the static host; the islands show their own error state.
  var realFetch = window.fetch;
  if (realFetch) {
    window.fetch = function (input, init) {
      var url = typeof input === 'string' ? input : (input && input.url) || '';
      if (isApi(url)) {
        return Promise.resolve(new Response(JSON.stringify({ error: 'preview', message: OFFLINE }), {
          status: 503, headers: { 'Content-Type': 'application/json' }
        }));
      }
      return realFetch.apply(this, arguments);
    };
  }

  // Submitting any form (Sovrium forms, sign-in, the Brevo newsletter) stops
  // here, before the islands' handlers or a navigation to an outside host.
  window.addEventListener('submit', function (e) {
    e.preventDefault();
    e.stopImmediatePropagation();
    notice(OFFLINE);
  }, true);

  // Links to routes that were not exported (the private /espace/* pages).
  document.addEventListener('click', function (e) {
    var a = e.target && e.target.closest && e.target.closest('a[data-unexported]');
    if (!a) return;
    e.preventDefault();
    notice(/^\/espace/.test(a.getAttribute('data-unexported')) ? PRIVATE : OFFLINE);
  }, true);

  // site.js marks the drawer link of the current page by comparing its href
  // with location.pathname, which a relative export never matches.
  document.addEventListener('DOMContentLoaded', function () {
    var here = location.href.split('#')[0];
    document.querySelectorAll('#mobile-menu a.mobile-nav-link').forEach(function (link) {
      if (link.href.split('#')[0] !== here || link.getAttribute('aria-current')) return;
      link.setAttribute('aria-current', 'page');
      link.classList.add('!text-orange-ink', '!bg-orange-light', 'border-l-4', 'border-orange');
    });
  });
})();
