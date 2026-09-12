/* =========================================================
   STUDENT PORTFOLIO — page-specific JavaScript
   - Staggered card entrance via IntersectionObserver
   - Subtle mouse-tilt on cards (desktop only)
   ========================================================= */

(function () {
    'use strict';

    var cards = document.querySelectorAll('.portfolio-card');
    if (!cards.length) return;

    /* ---------- 1. Staggered fade-in when cards enter viewport ---------- */
    if ('IntersectionObserver' in window) {
        var io = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry, i) {
                if (entry.isIntersecting) {
                    var el = entry.target;
                    el.style.transitionDelay = (i * 0.06) + 's';
                    el.style.opacity = '1';
                    el.style.transform = 'translateY(0)';
                    io.unobserve(el);

                    setTimeout(function () {
                        el.style.transitionDelay = '';
                    }, 800);
                }
            });
        }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

        cards.forEach(function (card) {
            card.style.opacity = '0';
            card.style.transform = 'translateY(24px)';
            card.style.transition =
                'opacity 0.6s ease, transform 0.6s ease, box-shadow 0.35s ease, border-color 0.35s ease';
            io.observe(card);
        });
    }

    /* ---------- 2. Subtle 3D tilt on hover (desktop only) ---------- */
    var supportsHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    if (!supportsHover) return;

    cards.forEach(function (card) {
        card.addEventListener('mousemove', function (e) {
            var rect = card.getBoundingClientRect();
            var x = (e.clientX - rect.left) / rect.width - 0.5;
            var y = (e.clientY - rect.top) / rect.height - 0.5;

            var tiltX = (y * -4).toFixed(2);
            var tiltY = (x * 4).toFixed(2);

            card.style.transform =
                'translateY(-6px) perspective(800px) rotateX(' + tiltX + 'deg) rotateY(' + tiltY + 'deg)';
        });

        card.addEventListener('mouseleave', function () {
            card.style.transform = '';
        });
    });

})();