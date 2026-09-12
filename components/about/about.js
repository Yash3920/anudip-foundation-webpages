/* =========================================================
   ABOUT PAGE — page-specific JavaScript
   - FAQ accordion
   - Count-up stat animation
   ========================================================= */

(function () {
  'use strict';

  /* ---------- FAQ ACCORDION ---------- */
  var faqButtons = document.querySelectorAll('.faq-q');
  faqButtons.forEach(function (btn) {
    btn.addEventListener('click', function () {
      var isExpanded = btn.getAttribute('aria-expanded') === 'true';
      // Close all
      faqButtons.forEach(function (b) {
        b.setAttribute('aria-expanded', 'false');
      });
      // Toggle current
      btn.setAttribute('aria-expanded', isExpanded ? 'false' : 'true');
    });
  });

  /* ---------- COUNT-UP STATS ---------- */
  var counters = document.querySelectorAll('.count-up');
  if (!counters.length) return;

  function animate(el) {
    var target = parseInt(el.getAttribute('data-target'), 10) || 0;
    var suffix = el.getAttribute('data-suffix') || '';
    var duration = 1400;
    var startTime = null;

    function step(timestamp) {
      if (!startTime) startTime = timestamp;
      var progress = Math.min((timestamp - startTime) / duration, 1);
      // easeOutCubic
      var eased = 1 - Math.pow(1 - progress, 3);
      var value = Math.floor(eased * target);
      el.textContent = value.toLocaleString('en-IN') + suffix;

      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        el.textContent = target.toLocaleString('en-IN') + suffix;
      }
    }

    requestAnimationFrame(step);
  }

  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          animate(entry.target);
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.4 });

    counters.forEach(function (c) { io.observe(c); });
  } else {
    counters.forEach(animate);
  }
})();