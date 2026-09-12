/* =========================================================
   STUDENT PROFILE — shared script
   Smooth in-page scroll + subtle fade-in for blocks
   ========================================================= */

(function () {
    'use strict';

    /* ---------- Smooth scroll for in-page anchors ---------- */
    document.querySelectorAll('a[href^="#"]').forEach(function (link) {
        link.addEventListener('click', function (e) {
            var id = link.getAttribute('href').slice(1);
            if (!id) return;
            var target = document.getElementById(id);
            if (!target) return;
            e.preventDefault();
            var offset = parseInt(getComputedStyle(document.documentElement)
                .getPropertyValue('--nav-h'), 10) || 76;
            var top = target.getBoundingClientRect().top + window.scrollY - offset - 20;
            window.scrollTo({ top: top, behavior: 'smooth' });
            history.replaceState(null, '', '#' + id);
        });
    });

    /* ---------- Fade-in blocks as they enter viewport ---------- */
    var blocks = document.querySelectorAll('.profile-block');
    if (!blocks.length) return;

    if ('IntersectionObserver' in window) {
        var io = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    var el = entry.target;
                    el.style.opacity = '1';
                    el.style.transform = 'translateY(0)';
                    io.unobserve(el);
                }
            });
        }, { threshold: 0.1, rootMargin: '0px 0px -30px 0px' });

        blocks.forEach(function (block) {
            block.style.opacity = '0';
            block.style.transform = 'translateY(14px)';
            block.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
            io.observe(block);
        });
    }
})();