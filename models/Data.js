const mongoose = require('mongoose');

const dataSchema = new mongoose.Schema({
  type: String,  // 'staff' atau 'ekstra'
  nama: String,
  deskripsi: String
});

module.exports = mongoose.model('Data', dataSchema);