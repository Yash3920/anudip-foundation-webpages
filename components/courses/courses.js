/* =========================================================
   COURSES PAGE — filter logic + staggered card entrance
   ========================================================= */

(function () {
    'use strict';

    /* ---------- 1. Filter buttons ---------- */
    var filterButtons = document.querySelectorAll('.course-filters button');
    var cards = document.querySelectorAll('.course-card');
    var empty = document.querySelector('.course-empty');

    filterButtons.forEach(function (btn) {
        btn.addEventListener('click', function () {
            filterButtons.forEach(function (b) { b.classList.remove('is-active'); });
            btn.classList.add('is-active');

            var filter = btn.getAttribute('data-filter');
            var visible = 0;

            cards.forEach(function (card) {
                var category = card.getAttribute('data-category');
                if (filter === 'all' || category === filter) {
                    card.classList.remove('is-hidden');
                    visible++;
                } else {
                    card.classList.add('is-hidden');
                }
            });

            if (empty) empty.hidden = visible !== 0;
        });
    });

    /* ---------- 2. Staggered entrance on scroll ---------- */
    if (!cards.length) return;

    if ('IntersectionObserver' in window) {
        var io = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry, i) {
                if (entry.isIntersecting) {
                    var el = entry.target;
                    el.style.transitionDelay = (i * 0.05) + 's';
                    el.style.opacity = '1';
                    el.style.transform = 'translateY(0)';
                    io.unobserve(el);
                    setTimeout(function () { el.style.transitionDelay = ''; }, 800);
                }
            });
        }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

        cards.forEach(function (card) {
            card.style.opacity = '0';
            card.style.transform = 'translateY(22px)';
            card.style.transition =
                'opacity 0.55s ease, transform 0.55s ease, box-shadow 0.3s ease, border-color 0.3s ease';
            io.observe(card);
        });
    }
})();

  /* Accordion — open one at a time */
  (function () {
    var items = document.querySelectorAll('.cd-acc-item');
    if (!items.length) return;

    items.forEach(function (item) {
      var head = item.querySelector('.cd-acc-head');
      var body = item.querySelector('.cd-acc-body');
      if (!head || !body) return;

      head.addEventListener('click', function () {
        var isOpen = item.classList.contains('is-open');

        items.forEach(function (other) {
          other.classList.remove('is-open');
          var h = other.querySelector('.cd-acc-head');
          var b = other.querySelector('.cd-acc-body');
          if (h) h.setAttribute('aria-expanded', 'false');
          if (b) b.hidden = true;
        });

        if (!isOpen) {
          item.classList.add('is-open');
          head.setAttribute('aria-expanded', 'true');
          body.hidden = false;
        }
      });
    });
  })();

