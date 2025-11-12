const mongoose = require('mongoose');

const ppdbSchema = new mongoose.Schema({
  nama: {
    type: String,
    required: [true, 'Nama wajib diisi'],
    trim: true,
    minlength: [3, 'Nama minimal 3 karakter'],
    maxlength: [100, 'Nama maksimal 100 karakter']
  },
  nisn: {
    type: String,
    required: [true, 'NISN wajib diisi'],
    unique: true,
    validate: {
      validator: v => /^\d{10}$/.test(v),
      message: 'NISN harus 10 digit angka'
    }
  },
  asal: {
    type: String,
    required: [true, 'Asal sekolah wajib diisi'],
    trim: true
  },
  alamat: {
    type: String,
    required: [true, 'Alamat wajib diisi'],
    trim: true
  },
  telp: {
    type: String,
    required: [true, 'No HP wajib diisi'],
    validate: {
      validator: v => /^\d{10,13}$/.test(v),
      message: 'No HP harus 10-13 digit angka'
    }
  },
  tanggal: {
    type: Date,
    default: Date.now
  },
  status: {
    type: String,
    enum: ['pending', 'contacted', 'registered'],
    default: 'pending'
  }
}, {
  timestamps: true
});

// Index untuk pencarian cepat
ppdbSchema.index({ nisn: 1 });
ppdbSchema.index({ tanggal: -1 });

module.exports = mongoose.model('Ppdb', ppdbSchema);