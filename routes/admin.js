const express = require('express');
const bcrypt = require('bcryptjs');
const { body, validationResult } = require('express-validator');
const Profil = require('../models/Profil');
const User = require('../models/User');
const router = express.Router();

// === MIDDLEWARE: CEK ADMIN ===
const isAdmin = (req, res, next) => {
  if (!req.session.adminId) {
    return res.redirect('/admin/login');
  }
  next();
};

// === LOGIN GET ===
router.get('/login', (req, res) => {
  res.render('admin/login', { error: null, csrfToken: req.csrfToken() });
});

// === LOGIN POST ===
router.post('/login', [
  body('username').trim().notEmpty().withMessage('Username wajib diisi'),
  body('password').notEmpty().withMessage('Password wajib diisi')
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.render('admin/login', {
      error: errors.array()[0].msg,
      csrfToken: req.csrfToken()
    });
  }

  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username });
    if (!user) {
      return res.render('admin/login', { error: 'Username tidak ditemukan', csrfToken: req.csrfToken() });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.render('admin/login', { error: 'Password salah', csrfToken: req.csrfToken() });
    }

    req.session.adminId = user._id;
    res.redirect('/admin/dashboard');
  } catch (err) {
    console.error('Login error:', err);
    res.render('admin/login', { error: 'Terjadi kesalahan server', csrfToken: req.csrfToken() });
  }
});

// === LOGOUT ===
router.get('/logout', (req, res) => {
  req.session.destroy(err => {
    if (err) console.error('Logout error:', err);
    res.redirect('/admin/login');
  });
});

// === DASHBOARD ===
router.get('/dashboard', isAdmin, async (req, res) => {
  try {
    const profils = await Profil.find().sort({ urutan: 1 });
    res.render('admin/dashboard', { profils, csrfToken: req.csrfToken() });
  } catch (err) {
    console.error('Dashboard error:', err);
    res.status(500).send('Gagal memuat dashboard');
  }
});

// === CREATE FORM ===
router.get('/create', isAdmin, (req, res) => {
  res.render('admin/edit', { profil: null, action: 'create', csrfToken: req.csrfToken() });
});

// === CREATE POST ===
router.post('/create', isAdmin, [
  body('nama').trim().notEmpty().withMessage('Nama wajib diisi'),
  body('deskripsi').trim().notEmpty().withMessage('Deskripsi wajib diisi'),
  body('tipe').isIn(['sekolah', 'sejarah', 'visi-misi', 'staff', 'tenaga-kependidikan', 'fasilitas']).withMessage('Tipe tidak valid'),
  body('urutan').isInt({ min: 0 }).withMessage('Urutan harus angka positif')
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.render('admin/edit', {
      profil: req.body,
      action: 'create',
      error: errors.array()[0].msg,
      csrfToken: req.csrfToken()
    });
  }

  try {
    const data = req.body;
    if (req.file) {
      data.foto = '/uploads/' + req.file.filename;
    }
    await new Profil(data).save();
    res.redirect('/admin/dashboard');
  } catch (err) {
    console.error('Create error:', err);
    res.render('admin/edit', {
      profil: req.body,
      action: 'create',
      error: 'Gagal menyimpan data',
      csrfToken: req.csrfToken()
    });
  }
});

// === EDIT FORM ===
router.get('/edit/:id', isAdmin, async (req, res) => {
  try {
    const profil = await Profil.findById(req.params.id);
    if (!profil) return res.status(404).send('Data tidak ditemukan');
    res.render('admin/edit', { profil, action: 'edit', csrfToken: req.csrfToken() });
  } catch (err) {
    console.error('Edit form error:', err);
    res.status(500).send('Gagal memuat form');
  }
});

// === UPDATE POST ===
router.post('/update/:id', isAdmin, [
  body('nama').trim().notEmpty(),
  body('deskripsi').trim().notEmpty(),
  body('tipe').isIn(['sekolah', 'sejarah', 'visi-misi', 'staff', 'tenaga-kependidikan', 'fasilitas']),
  body('urutan').isInt({ min: 0 })
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const profil = { ...req.body, _id: req.params.id };
    return res.render('admin/edit', {
      profil,
      action: 'edit',
      error: errors.array()[0].msg,
      csrfToken: req.csrfToken()
    });
  }

  try {
    const data = req.body;
    if (req.file) data.foto = '/uploads/' + req.file.filename;
    await Profil.findByIdAndUpdate(req.params.id, data);
    res.redirect('/admin/dashboard');
  } catch (err) {
    console.error('Update error:', err);
    res.status(500).send('Gagal memperbarui data');
  }
});

// === DELETE ===
router.post('/delete/:id', isAdmin, async (req, res) => {
  try {
    await Profil.findByIdAndDelete(req.params.id);
    res.redirect('/admin/dashboard');
  } catch (err) {
    console.error('Delete error:', err);
    res.redirect('/admin/dashboard');
  }
});

module.exports = router;