const mongoose = require("mongoose");
const ppdbSchema = new mongoose.Schema({
  nama: String,
  tanggalLahir: String,
  alamat: String,
  namaOrtu: String,
  noHpOrtu: String,
  dokumen: [String],
  tanggalDaftar: { type: Date, default: Date.now }
});
module.exports = mongoose.model("Ppdb", ppdbSchema);