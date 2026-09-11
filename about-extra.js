/* =========================================================
   ABOUT PAGE — EXTRA FEATURES (page-scoped, about.html only)
   Three independent features, each guarded so this file is
   safe even if a section is ever removed from the page.
   ========================================================= */

/* ---------- 1. "Then / Now" number counters ---------- */
document.querySelectorAll('.count-up').forEach(el => {
  const target = parseInt(el.dataset.target, 10);
  const suffix = el.dataset.suffix || '';
  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const duration = 1200;
      const start = performance.now();
      function tick(now) {
        const progress = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        el.textContent = Math.floor(eased * target).toLocaleString('en-IN') + suffix;
        if (progress < 1) requestAnimationFrame(tick);
        else el.textContent = target.toLocaleString('en-IN') + suffix;
      }
      requestAnimationFrame(tick);
      obs.unobserve(el);
    });
  }, { threshold: 0.5 });
  observer.observe(el);
});

/* ---------- 2. Timeline nodes fade in as they scroll into view ---------- */
const timelineObserver = new IntersectionObserver((entries, obs) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('is-visible');
      obs.unobserve(entry.target);
    }
  });
}, { threshold: 0.3 });
document.querySelectorAll('.story-node').forEach(node => timelineObserver.observe(node));

/* ---------- 3. FAQ accordion ---------- */
document.querySelectorAll('.faq-item').forEach(item => {
  const question = item.querySelector('.faq-q');
  const answer = item.querySelector('.faq-a');

  question.addEventListener('click', () => {
    const isOpen = item.classList.contains('is-open');

    // close any other open FAQ item first
    document.querySelectorAll('.faq-item.is-open').forEach(open => {
      if (open !== item) {
        open.classList.remove('is-open');
        open.querySelector('.faq-q').setAttribute('aria-expanded', 'false');
        open.querySelector('.faq-a').style.height = '0px';
      }
    });

    item.classList.toggle('is-open', !isOpen);
    question.setAttribute('aria-expanded', String(!isOpen));
    answer.style.height = isOpen ? '0px' : answer.scrollHeight + 'px';
  });
});
