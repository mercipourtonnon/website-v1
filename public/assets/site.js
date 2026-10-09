// mercipourtonnon — site behaviors ported from the original static site.
// Loaded on every page (defer, body-end). Team-card flip is pure CSS;
// testimonial reveal is handled by Sovrium's scroll-animation runtime;
// smooth anchor scrolling is CSS (scroll-behavior + scroll-margin-top).
// Workshop dates are server-rendered from the `workshops` table (hero and
// #events galleries in config/pages/home.yaml); nothing here touches them.
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

  // ── Scroll-spy: highlight the nav link of the section in view ────────────
  function initScrollSpy() {
    var ids = ['atelier', 'temoignages', 'pour-qui', 'programme', 'infos-pratiques',
               'mission', 'valeurs', 'equipe', 'faq', 'newsletter'];
    var desktopLinks = document.querySelectorAll('.nav-link');
    var mobileLinks = document.querySelectorAll('.mobile-nav-link');
    if (!desktopLinks.length && !mobileLinks.length) return;
    var nav = document.querySelector('nav');

    function updateActiveNav() {
      var totalOffset = nav ? nav.offsetHeight : 0;
      var scrollPosition = window.scrollY + totalOffset + 100;
      var currentSection = '';

      ids.forEach(function (id) {
        var element = document.getElementById(id);
        if (element) {
          var top = element.offsetTop;
          if (scrollPosition >= top && scrollPosition < top + element.offsetHeight) {
            currentSection = '#' + id;
          }
        }
      });

      desktopLinks.forEach(function (link) {
        var active = link.getAttribute('href') === currentSection;
        link.classList.toggle('!text-orange', active);
        link.classList.toggle('border-b-2', active);
        link.classList.toggle('border-orange', active);
      });

      mobileLinks.forEach(function (link) {
        var active = link.getAttribute('href') === currentSection;
        link.classList.toggle('!text-orange', active);
        link.classList.toggle('!bg-orange-light', active);
        link.classList.toggle('border-l-4', active);
        link.classList.toggle('border-orange', active);
      });
    }

    updateActiveNav();
    var scrollTimeout;
    window.addEventListener('scroll', function () {
      if (scrollTimeout) window.cancelAnimationFrame(scrollTimeout);
      scrollTimeout = window.requestAnimationFrame(updateActiveNav);
    });
  }

  function init() {
    initMobileMenuClose();
    initScrollSpy();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
