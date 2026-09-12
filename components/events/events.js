/* =========================================================
   EVENTS & GALLERY — page-specific JavaScript
   Handles the lightbox for gallery tiles.
   ========================================================= */

(function () {
  'use strict';

  var lightbox = document.getElementById('lightbox');
  var lightboxTitle = document.getElementById('lightboxTitle');
  var lightboxText = document.getElementById('lightboxText');
  var lightboxClose = document.getElementById('lightboxClose');
  var tiles = document.querySelectorAll('.gallery-item');

  if (!lightbox || !tiles.length) return;

  var lastFocused = null;

  /* ---------- Open ---------- */
  function openLightbox(tile) {
    var caption = tile.getAttribute('data-caption') || 'Anudip Foundation event';
    var label = tile.querySelector('.gallery-label');
    var labelText = label ? label.textContent.trim() : 'Event';

    lightboxTitle.textContent = labelText;
    lightboxText.textContent = caption;

    lightbox.hidden = false;
    lightbox.classList.add('is-open');

    lastFocused = document.activeElement;
    if (lightboxClose) lightboxClose.focus();
  }

  /* ---------- Close ---------- */
  function closeLightbox() {
    lightbox.classList.remove('is-open');
    lightbox.hidden = true;
    if (lastFocused && typeof lastFocused.focus === 'function') {
      lastFocused.focus();
    }
  }

  /* ---------- Bind tiles ---------- */
  tiles.forEach(function (tile) {
    tile.addEventListener('click', function () {
      openLightbox(tile);
    });
  });

  /* ---------- Bind close button ---------- */
  if (lightboxClose) {
    lightboxClose.addEventListener('click', closeLightbox);
  }

  /* ---------- Close on outside click ---------- */
  lightbox.addEventListener('click', function (e) {
    if (e.target === lightbox) closeLightbox();
  });

  /* ---------- Close on Escape ---------- */
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && lightbox.classList.contains('is-open')) {
      closeLightbox();
    }
  });

})();