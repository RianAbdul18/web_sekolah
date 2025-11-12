// public/js/ppdb.js
document.addEventListener('DOMContentLoaded', function () {
  const form = document.querySelector('form');
  const kirimBtn = document.querySelector('.kirim');
  const notif = document.getElementById('notif');

  if (!kirimBtn || !form) return;

  kirimBtn.addEventListener('click', async function (e) {
    e.preventDefault();
    e.stopPropagation();

    // Reset notif
    notif.innerHTML = '';
    notif.className = 'notif';

    // Ambil data
    const data = {};
    let hasError = false;

    form.querySelectorAll('[data-name]').forEach(field => {
      const name = field.dataset.name;
      const value = field.value.trim();
      const label = field.closest('.form-group')?.querySelector('label')?.textContent || name;

      // Validasi client-side
      if (!value) {
        showError(`${label} wajib diisi`);
        hasError = true;
        return;
      }

      if (name === 'nisn' && value.length !== 10) {
        showError('NISN harus 10 digit');
        hasError = true;
        return;
      }

      if (name === 'telp' && !/^\d{10,13}$/.test(value)) {
        showError('Nomor HP harus 10-13 digit');
        hasError = true;
        return;
      }

      data[name] = value;
    });

    if (hasError) return;

    // Disable tombol
    kirimBtn.disabled = true;
    kirimBtn.textContent = 'Menyimpan...';

    try {
      const res = await fetch('/ppdb/save', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-Token': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || ''
        },
        body: JSON.stringify(data)
      });

      const result = await res.json();

      if (result.success) {
        // Format WhatsApp
        const teks = `*PENDAFTARAN PPDB MTS DARUL FALAH*\n\n` +
          `Nama: ${data.nama}\n` +
          `NISN: ${data.nisn}\n` +
          `Asal Sekolah: ${data.asal}\n` +
          `Alamat: ${data.alamat}\n` +
          `No. HP: ${data.telp}\n\n` +
          `_Pendaftaran telah diterima. Kami akan menghubungi secepatnya._`;

        const waUrl = `https://wa.me/6285453220024?text=${encodeURIComponent(teks)}`;
        window.open(waUrl, '_blank');

        notif.innerHTML = `
          <div style="color: green; font-weight: bold;">
            Pendaftaran berhasil! WhatsApp terbuka.
          </div>`;
        form.reset();
      } else {
        showError(result.error || 'Gagal menyimpan data');
      }
    } catch (err) {
      console.error('PPDB Error:', err);
      showError('Koneksi gagal. Coba lagi.');
    } finally {
      kirimBtn.disabled = false;
      kirimBtn.textContent = 'Kirim via WhatsApp';
    }
  });

  function showError(msg) {
    notif.innerHTML = `<div style="color: red; font-weight: bold;">${msg}</div>`;
  }
});