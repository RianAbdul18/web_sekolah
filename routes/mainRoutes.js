const express = require('express');
const fs = require('fs');
const path = require('path');
const { body, validationResult } = require('express-validator');
const Ppdb = require('../models/Ppdb');
const router = express.Router();

// === HALAMAN UTAMA (BERANDA) ===
router.get('/', (req, res) => {
  try {
    const dataPath = path.join(__dirname, '../data/home.json');
    const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
    res.render('beranda', { 
      title: 'Beranda', 
      data,
      csrfToken: req.csrfToken()
    });
  } catch (err) {
    console.error('Error reading home.json:', err);
    res.status(500).render('beranda', { 
      title: 'Beranda', 
      data: { slider: [], sambutan: '', agenda: [] },
      error: 'Gagal memuat data beranda'
    });
  }
});

// === SIMPAN PPDB DENGAN VALIDASI ===
router.post('/ppdb/save', [
  body('nama').trim().notEmpty().withMessage('Nama wajib diisi'),
  body('nisn').trim().isLength({ min: 10, max: 10 }).withMessage('NISN harus 10 digit'),
  body('asal').trim().notEmpty().withMessage('Asal sekolah wajib diisi'),
  body('alamat').trim().notEmpty().withMessage('Alamat wajib diisi'),
  body('telp').trim().isMobilePhone('id-ID').withMessage('Nomor HP tidak valid'),
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ 
      success: false, 
      error: errors.array()[0].msg 
    });
  }

  try {
    const { nama, nisn, asal, alamat, telp } = req.body;
    await Ppdb.create({
      nama,
      nisn,
      asal,
      alamat,
      telp,
      tanggal: new Date()
    });
    res.json({ success: true });
  } catch (err) {
    console.error('Error saving PPDB:', err);
    res.status(500).json({ 
      success: false, 
      error: 'Gagal menyimpan data pendaftaran' 
    });
  }
});

module.exports = router;