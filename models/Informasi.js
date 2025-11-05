const mongoose = require("mongoose");
const infoSchema = new mongoose.Schema({
  judul: String,
  tanggal: { type: Date, default: Date.now },
  gambar: String,
  isi: String
});
module.exports = mongoose.model("Informasi", infoSchema);