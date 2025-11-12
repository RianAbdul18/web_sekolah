const mongoose = require('mongoose');

const profilSchema = new mongoose.Schema({
  nama: {
    type: String,
    required: [true, 'Nama wajib diisi'],
    trim: true,
    minlength: [3, 'Nama minimal 3 karakter'],
    maxlength: [100, 'Nama maksimal 100 karakter']
  },
  deskripsi: {
    type: String,
    required: [true, 'Deskripsi wajib diisi'],
    trim: true,
    maxlength: [500, 'Deskripsi maksimal 500 karakter']
  },
  isi: {
    type: String,
    trim: true
  },
  foto: {
    type: String,
    validate: {
      validator: v => !v || v.startsWith('/uploads/'),
      message: 'Foto harus berupa path upload'
    }
  },
  urutan: {
    type: Number,
    default: 0,
    min: [0, 'Urutan minimal 0']
  },
  tipe: {
    type: String,
    required: [true, 'Tipe wajib diisi'],
    enum: {
      values: ['sekolah', 'sejarah', 'visi-misi', 'staff', 'tenaga-kependidikan', 'fasilitas'],
      message: 'Tipe tidak valid'
    }
  }
}, {
  timestamps: true
});

// Index untuk performa
profilSchema.index({ tipe: 1, urutan: 1 });
profilSchema.index({ nama: 'text', deskripsi: 'text' });

module.exports = mongoose.model('Profil', profilSchema);