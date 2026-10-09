// mercipourtonnon — site behaviors ported from the original static site.
// Loaded on every page (defer, body-end). Team-card flip is pure CSS;
// testimonial reveal is handled by Sovrium's scroll-animation runtime;
// smooth anchor scrolling is CSS (scroll-behavior + scroll-margin-top).
// Workshop dates are server-rendered from the `workshops` table (home hero,
// /nos-ateliers #events); nothing here touches them.
(function () {
  'use strict';

  // ── Mobile menu: close when a menu link is clicked ───────────────────────
  // The hamburger / close button / overlay toggle #mobile-menu via Sovrium's
  // built-in toggleElement interaction (inline style.display). Menu links
  // navigate to anchors, so we just hide the menu on click.
  function initMobileMenuClose() {
    var menu = document.getElementById('mobile-menu');
    if (!menu) return;
    menu.addEventListener('click', function (e) {
      if (e.target.closest('.mobile-nav-link') || e.target.id === 'menu-overlay') {
        menu.style.display = 'none';
      }
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && menu.style.display !== 'none') {
        menu.style.display = 'none';
      }
    });
  }

  // ── Current page: mark the drawer link of the page being read ────────────
  // The header links are routes since the one-page home was split (review of
  // 2026-10-09), so the old section scroll-spy had nothing left to match.
  // The desktop links live in the navigation-menu island and are left alone.
  function initCurrentPage() {
    var path = window.location.pathname.replace(/\/$/, '') || '/';
    document.querySelectorAll('#mobile-menu a.mobile-nav-link').forEach(function (link) {
      if (link.getAttribute('href') !== path) return;
      link.setAttribute('aria-current', 'page');
      link.classList.add('!text-orange-ink', '!bg-orange-light', 'border-l-4', 'border-orange');
    });
  }

  // FAQ toggles: Sovrium's toggleElement flips the answer's inline display but
  // sets no ARIA state, so mirror it on the question button after each click.
  function initFaqAria() {
    document.querySelectorAll('.faq-q').forEach(function (button) {
      var answer = button.nextElementSibling;
      if (!answer || !answer.classList.contains('faq-answer') || !answer.id) return;
      button.setAttribute('aria-controls', answer.id);
      var sync = function () {
        button.setAttribute('aria-expanded', String(answer.style.display !== 'none'));
      };
      sync();
      button.addEventListener('click', function () { setTimeout(sync, 0); });
    });
  }

  function init() {
    initMobileMenuClose();
    initCurrentPage();
    initFaqAria();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
