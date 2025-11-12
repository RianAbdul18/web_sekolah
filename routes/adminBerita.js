const express = require('express');
const { body, validationResult } = require('express-validator');
const Informasi = require('../models/Informasi');
const router = express.Router();

const isAdmin = (req, res, next) => {
  if (!req.session.adminId) return res.redirect('/admin/login');
  next();
};

router.get('/berita', isAdmin, async (req, res) => {
  try {
    const berita = await Informasi.find().sort({ tanggal: -1 });
    res.render('admin/berita', { berita, error: null, csrfToken: req.csrfToken() });
  } catch (err) {
    console.error('Error loading berita:', err);
    res.status(500).render('admin/berita', { berita: [], error: 'Gagal memuat data', csrfToken: req.csrfToken() });
  }
});

router.post('/berita/create', isAdmin, [
  body('judul').trim().notEmpty().withMessage('Judul wajib').isLength({ max: 200 }).withMessage('Judul maksimal 200 karakter'),
  body('isi').trim().notEmpty().withMessage('Isi berita wajib')
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const berita = await Informasi.find().sort({ tanggal: -1 });
    return res.render('admin/berita', {
      berita,
      error: errors.array()[0].msg,
      csrfToken: req.csrfToken()
    });
  }

  try {
    await Informasi.create({
      judul: req.body.judul,
      isi: req.body.isi,
      tanggal: new Date()
    });
    res.redirect('/admin/berita');
  } catch (err) {
    console.error('Error creating berita:', err);
    const berita = await Informasi.find().sort({ tanggal: -1 });
    res.render('admin/berita', { berita, error: 'Gagal menyimpan berita', csrfToken: req.csrfToken() });
  }
});

router.post('/berita/delete/:id', isAdmin, async (req, res) => {
  try {
    const result = await Informasi.findByIdAndDelete(req.params.id);
    if (!result) return res.status(404).redirect('/admin/berita');
    res.redirect('/admin/berita');
  } catch (err) {
    console.error('Error deleting berita:', err);
    res.redirect('/admin/berita');
  }
});

module.exports = router;