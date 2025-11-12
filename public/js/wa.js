document.getElementById('formWa').addEventListener('submit', function(e) {
  e.preventDefault();
  
  const nama = document.getElementById('nama').value;
  const email = document.getElementById('email').value;
  const pesan = document.getElementById('pesan').value;
  
  const teks = `*PESAN DARI WEBSITE*%0A%0A` +
               `*Nama:* ${nama}%0A` +
               `*Email:* ${email || 'Tidak diisi'}%0A%0A` +
               `*Pesan:*%0A${pesan}`;
  
  const noWa = "085973781774";
  const url = `https://wa.me/${noWa}?text=${teks}`;
  
  // Kirim & notif
  window.open(url, '_blank');
  document.getElementById('notif').innerHTML = "Pesan terkirim! WhatsApp terbuka";
  
  // Reset form
  this.reset();
});