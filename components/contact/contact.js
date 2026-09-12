/* =========================================================
   CONTACT PAGE — Formspree submission + button animation
   ========================================================= */

function handleForm(e) {
  e.preventDefault();

  var form = document.getElementById('contactForm');
  if (!form) return false;

  var note = document.getElementById('contactNote');

  /* ---------- 1. Validate all fields first ---------- */
  if (!validateAllFields(form)) {
    if (note) {
      note.textContent = 'Please fix the highlighted fields and try again.';
      note.className = 'form-note is-error';
    }
    var firstError = form.querySelector('.field.has-error input, .field.has-error textarea');
    if (firstError) firstError.focus();
    return false;
  }

  /* ---------- 2. Grab button + label ---------- */
  var btn = document.getElementById('sendBtn');
  var txt = document.getElementById('btnText');
  if (!btn || !txt) return false;

  var originalText = txt.textContent || 'Send Message';

  /* ---------- 3. Animate: "Sending..." ---------- */
  txt.textContent = 'Sending...';
  btn.disabled = true;
  if (note) {
    note.textContent = '';
    note.className = 'form-note';
  }

  /* ---------- 4. Send to Formspree ---------- */
  var formData = new FormData(form);

  fetch(form.action, {
    method: 'POST',
    body: formData,
    headers: { 'Accept': 'application/json' }
  })
    .then(function (response) {
      if (response.ok) {
        /* ---------- 5a. Success ---------- */
        txt.textContent = 'Sent! ✓';
        btn.style.background = 'linear-gradient(135deg, #059669, #10b981)';

        if (note) {
          note.textContent = "Thank you! Your message has been received. We'll reply within two working days.";
          note.className = 'form-note is-success';
        }

        form.reset();
        form.querySelectorAll('.field').forEach(function (f) { f.classList.remove('has-error'); });
        form.querySelectorAll('.field-error').forEach(function (f) { f.textContent = ''; });
      } else {
        /* ---------- 5b. Server rejected ---------- */
        return response.json().then(function (data) {
          throw new Error((data && data.errors && data.errors[0] && data.errors[0].message) || 'Submission failed.');
        });
      }
    })
    .catch(function (error) {
      /* ---------- 5c. Network / server error ---------- */
      txt.textContent = 'Try again';
      btn.style.background = 'linear-gradient(135deg, #dc2626, #ef4444)';
      if (note) {
        note.textContent = "Something went wrong: " + error.message;
        note.className = 'form-note is-error';
      }
    })
    .finally(function () {
      /* ---------- 6. Restore button after 3s ---------- */
      setTimeout(function () {
        txt.textContent = originalText;
        btn.disabled = false;
        btn.style.background = '';
      }, 3000);
    });

  return false;
}

/* ---------- Field validation helpers ---------- */
function isValidEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function setFieldError(field, message) {
  var wrapper = field.closest('.field');
  if (!wrapper) return;
  var errorEl = wrapper.querySelector('.field-error');
  if (message) {
    wrapper.classList.add('has-error');
    if (errorEl) errorEl.textContent = message;
  } else {
    wrapper.classList.remove('has-error');
    if (errorEl) errorEl.textContent = '';
  }
}

function validateField(field) {
  var name = field.name;
  var value = (field.value || '').trim();

  if (name === 'name') {
    if (!value) { setFieldError(field, 'Please enter your name.'); return false; }
    if (value.length < 2) { setFieldError(field, 'Name should be at least 2 characters.'); return false; }
  }
  if (name === 'email') {
    if (!value) { setFieldError(field, 'Please enter your email address.'); return false; }
    if (!isValidEmail(value)) { setFieldError(field, 'Please enter a valid email address.'); return false; }
  }
  if (name === 'message') {
    if (!value) { setFieldError(field, 'Please write a short message.'); return false; }
    if (value.length < 10) { setFieldError(field, 'Message should be at least 10 characters.'); return false; }
  }
  setFieldError(field, '');
  return true;
}

function validateAllFields(form) {
  var fields = form.querySelectorAll('input, select, textarea');
  var allValid = true;
  fields.forEach(function (field) {
    if (!validateField(field)) allValid = false;
  });
  return allValid;
}

/* ---------- Live validation on blur / input ---------- */
(function () {
  var form = document.getElementById('contactForm');
  if (!form) return;

  form.querySelectorAll('input, select, textarea').forEach(function (field) {
    field.addEventListener('blur', function () { validateField(field); });
    field.addEventListener('input', function () {
      if (field.closest('.field').classList.contains('has-error')) {
        validateField(field);
      }
    });
  });
})();