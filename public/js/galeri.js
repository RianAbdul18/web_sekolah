function openLightbox(src, caption) {
  document.getElementById('lightbox').classList.add('active');
  document.getElementById('lightbox-img').src = src;
  document.getElementById('caption').textContent = caption;
}

function closeLightbox() {
  document.getElementById('lightbox').classList.remove('active');
}

// Tutup dengan ESC
document.addEventListener('keyup', e => {
  if (e.key === 'Escape') closeLightbox();
});