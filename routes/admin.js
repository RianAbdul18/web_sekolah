const express = require('express');
const bcrypt = require('bcryptjs');
const Profil = require('../models/Profil');
const router = express.Router();

// Middleware auth
const isAdmin = (req, res, next) => {
  if (!req.session.adminId) return res.redirect('/admin/login');
  next();
};

// Login GET
router.get('/login', (req, res) => {
  res.render('admin/login', { error: null });
});

// Login POST
router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    // Cek user (hardcode atau dari DB)
    if (username !== process.env.ADMIN_USERNAME) {
      return res.render('admin/login', { error: 'Username salah' });
    }
    const hashed = await bcrypt.hash(process.env.ADMIN_PASSWORD, 10);  // Hash sekali
    const match = await bcrypt.compare(password, hashed);
    if (!match) return res.render('admin/login', { error: 'Password salah' });
    
    req.session.adminId = username;
    res.redirect('/admin/dashboard');
  } catch (err) {
    res.render('admin/login', { error: 'Error server' });
  }
});

// Logout
router.get('/logout', (req, res) => {
  req.session.destroy();
  res.redirect('/admin/login');
});

// Dashboard: Read all Profil
router.get('/dashboard', isAdmin, async (req, res) => {
  const profils = await Profil.find({}).sort({ urutan: 1 });
  res.render('admin/dashboard', { profils });
});

// Create: Form tambah
router.get('/create', isAdmin, (req, res) => {
  res.render('admin/edit', { profil: null, action: 'create' });
});

// Create POST
router.post('/create', isAdmin, async (req, res) => {
  const profil = new Profil(req.body);
  await profil.save();
  res.redirect('/admin/dashboard');
});

// Update: Form edit
router.get('/edit/:id', isAdmin, async (req, res) => {
  const profil = await Profil.findById(req.params.id);
  if (!profil) return res.status(404).send('Not found');
  res.render('admin/edit', { profil, action: 'edit' });
});

// Update POST
router.post('/update/:id', isAdmin, async (req, res) => {
  await Profil.findByIdAndUpdate(req.params.id, req.body);
  res.redirect('/admin/dashboard');
});

// Delete
router.post('/delete/:id', isAdmin, async (req, res) => {
  await Profil.findByIdAndDelete(req.params.id);
  res.redirect('/admin/dashboard');
});

module.exports = router;