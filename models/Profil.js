const mongoose = require('mongoose');

const profilSchema = new mongoose.Schema({
  nama: { type: String, required: true },  // e.g. "Staf Pengajar"
  deskripsi: { type: String, required: true },  // Isi singkat
  isi: { type: String },  // Isi lengkap untuk halaman
  foto: { type: String },  // Path foto, e.g. "/img/staff1.jpg"
  urutan: { type: Number, default: 0 },  // Urut di submenu
  tipe: { type: String, enum: ['sekolah', 'sejarah', 'staff', 'visi-misi', 'tenaga-kependidikan', 'fasilitas'], required: true }
});

module.exports = mongoose.model('Profil', profilSchema);