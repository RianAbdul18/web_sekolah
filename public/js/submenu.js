document.querySelectorAll('.dropdown > a').forEach(trigger => {
  trigger.addEventListener('click', function(e) {
    e.preventDefault();
    const parent = this.parentElement;
    const isActive = parent.classList.contains('active');

    // Tutup semua
    document.querySelectorAll('.dropdown').forEach(d => d.classList.remove('active'));
    
    // Buka yang diklik (kecuali kalau sudah aktif)
    if (!isActive) {
      parent.classList.add('active');
    }
  });
});

// Tutup kalau klik di luar
document.addEventListener('click', function(e) {
  if (!e.target.closest('.dropdown')) {
    document.querySelectorAll('.dropdown').forEach(d => d.classList.remove('active'));
  }
});