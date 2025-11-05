const mongoose = require("mongoose");
const galeriSchema = new mongoose.Schema({
  judul: String,
  gambar: String,
  deskripsi: String,
  tanggal: { type: Date, default: Date.now }
});
module.exports = mongoose.model("Galeri", galeriSchema);