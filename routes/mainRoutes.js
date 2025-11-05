const express = require('express');
const Data = require('../models/Data');
const router = express.Router();

router.get('/', (req, res) => res.render('beranda', { title: 'Beranda' }));

router.get('/profil', async (req, res) => {
  const staff = await Data.find({ type: 'staff' });  // Ambil data staff dari DB
  res.render('profil', { title: 'Profil', staff });
});

router.get('/ekstrakurikuler', async (req, res) => {
  const ekstra = await Data.find({ type: 'ekstra' });  // Ambil data ekstra dari DB
  res.render('ekstrakurikuler', { title: 'Ekstrakurikuler', ekstra });
});

router.get('/galeri', (req, res) => res.render('galeri', { title: 'Galeri' }));
router.get('/kurikulum', (req, res) => res.render('kurikulum', { title: 'Kurikulum' }));
router.get('/ppdb', (req, res) => res.render('ppdb', { title: 'PPDB' }));

module.exports = router;