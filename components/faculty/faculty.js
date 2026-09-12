/* =========================================================
   FACULTY PAGE — page-specific JavaScript
   - Staggered card entrance via IntersectionObserver
   - Subtle mouse-tilt on cards (opt-in, disabled on touch)
   ========================================================= */

(function () {
  'use strict';

  var cards = document.querySelectorAll('.faculty-card');
  if (!cards.length) return;

  /* ---------- 1. Staggered fade-in when cards enter viewport ---------- */
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry, i) {
        if (entry.isIntersecting) {
          var el = entry.target;
          // Small per-card delay to create a wave effect
          el.style.transitionDelay = (i * 0.06) + 's';
          el.style.opacity = '1';
          el.style.transform = 'translateY(0)';
          io.unobserve(el);

          // Clean up the delay after the animation so hover is snappy
          setTimeout(function () {
            el.style.transitionDelay = '';
          }, 800);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

    cards.forEach(function (card) {
      // Set initial state before observing
      card.style.opacity = '0';
      card.style.transform = 'translateY(24px)';
      card.style.transition = 'opacity 0.6s ease, transform 0.6s ease, box-shadow 0.3s ease, border-color 0.3s ease';
      io.observe(card);
    });
  }

  /* ---------- 2. Subtle mouse-tilt (pointer devices only) ---------- */
  var supportsHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  if (!supportsHover) return;

  cards.forEach(function (card) {
    card.addEventListener('mousemove', function (e) {
      var rect = card.getBoundingClientRect();
      var x = (e.clientX - rect.left) / rect.width - 0.5;  // -0.5 … 0.5
      var y = (e.clientY - rect.top) / rect.height - 0.5;

      // Gentle tilt — max ~5deg
      var tiltX = (y * -5).toFixed(2);
      var tiltY = (x * 5).toFixed(2);

      card.style.transform =
        'translateY(-6px) perspective(700px) rotateX(' + tiltX + 'deg) rotateY(' + tiltY + 'deg)';
    });

    card.addEventListener('mouseleave', function () {
      // Return to the hover resting state (matches .faculty-card:hover)
      card.style.transform = '';
    });
  });

})();