/* =========================================================
   This site is intentionally almost all HTML + CSS.
   The mobile menu uses a pure-CSS checkbox hack (see the
   header in each page). JavaScript here only does two
   small things that genuinely need it:

   1. Opening/closing the gallery lightbox on events.html
   2. Validating the contact form on contact.html

   Both blocks check that their elements exist first, so
   this one file can be safely linked from every page.
   ========================================================= */


/* ---------------------------------------------------------
   1. GALLERY LIGHTBOX (events.html)
   Clicking a gallery tile opens a simple modal showing its
   caption. Closes on the close button, backdrop click, or Esc.
   --------------------------------------------------------- */
const galleryItems = document.querySelectorAll('.gallery-item');
const lightbox = document.getElementById('lightbox');

if (galleryItems.length && lightbox) {
  const lightboxTitle = document.getElementById('lightboxTitle');
  const closeBtn = document.getElementById('lightboxClose');

  function openLightbox(caption) {
    lightboxTitle.textContent = caption;
    lightbox.classList.add('is-open');
  }
  function closeLightbox() {
    lightbox.classList.remove('is-open');
  }

  galleryItems.forEach(item => {
    item.addEventListener('click', () => openLightbox(item.dataset.caption));
  });

  closeBtn.addEventListener('click', closeLightbox);
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLightbox(); // clicked the dark backdrop, not the box
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeLightbox();
  });
}


/* ---------------------------------------------------------
   2. CONTACT FORM VALIDATION (contact.html)
   --------------------------------------------------------- */
const contactForm = document.getElementById('contactForm');

if (contactForm) {
  const contactNote = document.getElementById('contactNote');

  function setFieldError(fieldName, message) {
    const errorEl = document.querySelector(`[data-error-for="${fieldName}"]`);
    if (!errorEl) return;
    errorEl.textContent = message;
    errorEl.closest('.field').classList.toggle('has-error', Boolean(message));
  }

  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const message = document.getElementById('message').value.trim();
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    let isValid = true;

    if (name.length < 2) { setFieldError('name', 'Please enter your name.'); isValid = false; }
    else { setFieldError('name', ''); }

    if (!emailPattern.test(email)) { setFieldError('email', 'Please enter a valid email address.'); isValid = false; }
    else { setFieldError('email', ''); }

    if (message.length < 10) { setFieldError('message', 'Please write at least a short sentence.'); isValid = false; }
    else { setFieldError('message', ''); }

    if (!isValid) { contactNote.textContent = ''; return; }

    contactNote.textContent = `Thanks, ${name.split(' ')[0]} — we'll reply to ${email} soon.`;
    contactForm.reset();
  });
}
