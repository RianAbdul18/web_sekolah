const steps = document.querySelectorAll('.step');
const progress = document.querySelector('.progress');
let current = 0;

function showStep(n) {
  steps.forEach(s => s.classList.remove('active'));
  steps[n].classList.add('active');
  progress.style.width = `${(n + 1) * 16.66}%`;
}

document.querySelectorAll('.next').forEach(btn => {
  btn.onclick = () => {
    if (validateStep(current)) {
      current++;
      showStep(current);
    }
  };
});

document.querySelectorAll('.prev').forEach(btn => {
  btn.onclick = () => {
    current--;
    showStep(current);
  };
});

function validateStep(n) {
  const inputs = steps[n].querySelectorAll('[required]');
  for (let input of inputs) {
    if (!input.value.trim()) {
      alert('Harap isi semua kolom bertanda *');
      return false;
    }
  }
  return true;
}

// KIRIM KE WA
document.querySelector('.kirim').onclick = () => {
  const data = {};
  document.querySelectorAll('[data-name]').forEach(el => {
    data[el.dataset.name] = el.value;
  });

  const teks = `*PPDB MTs DARUL FALAH*%0A%0A` +
    `*1. DATA DIRI*%0A` +
    `Nama: ${data.nama}%0ANISN: ${data.nisn}%0ANIK: ${data.nik}%0A` +
    `JK: ${data.jenis_kelamin}%0ATempat, Tgl Lahir: ${data.tempat_lahir}, ${data.tgl_lahir}%0A%0A` +
    `*2. ALAMAT*%0A${data.alamat}%0ART/RW: ${data.rt_rw}%0A${data.desa}, ${data.kecamatan}, ${data.kabupaten}%0A%0A` +
    `*3. ORANG TUA*%0A` +
    `Ayah: ${data.nama_ayah} (${data.pekerjaan_ayah})%0A` +
    `Ibu: ${data.nama_ibu} (${data.pekerjaan_ibu})%0A` +
    `WA Ortu: ${data.wa_ortu}%0A%0A` +
    `*4. ASAL SEKOLAH*%0A${data.asal_sekolah}%0A%0A` +
    `Terima kasih! Mohon konfirmasi via WA.`;

  const url = `https://wa.me/085453220024?text=${teks}`;
  window.open(url, '_blank');
  document.getElementById('notif').innerHTML = "Pendaftaran berhasil! WhatsApp terbuka";
};