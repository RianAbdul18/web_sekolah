require('dotenv').config();
const express = require('express');
const path = require('path');
const app = express();
const PORT = 3000;

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static('public'));

app.get('/', (req, res) => {
  const data = require('./data/home.json');
  res.render('beranda', { data });
});

// ROUTE PROFIL
app.get('/profil/:page', (req, res) => {
  const pages = {
    sekolah: 'Profil Sekolah',
    sejarah: 'Sejarah Singkat',
    staff: 'Staf Pengajar',
    'visi-misi': 'Visi, Misi & Tujuan',
    'tenaga-kependidikan': 'Staf Tenaga Kependidikan',
    fasilitas: 'Fasilitas'
  };
  const page = req.params.page;
  const title = pages[page] || 'Profil';
  res.render(`profil-${page}`, { title });
});

// ROUTE EKSTRAKURIKULER
const ekstraData = require('./data/ekstra.json');

app.get('/ekstra/:id', (req, res) => {
  const ekstra = ekstraData.find(e => e.id === req.params.id);
  if (!ekstra) return res.status(404).send('Tidak ditemukan');
  res.render('ekstra-detail', { ekstra });
});

app.get('/ekstra', (req, res) => {
  res.render('ekstra-list', { ekstras: ekstraData });
});

app.get('/galeri', (req, res) => {
  res.render('galeri');
});

app.get('/kontak', (req, res) => {
  res.render('kontak');
});

app.get('/ppdb', (req, res) => {
  res.render('ppdb');
});

const beritaData = require('./data/berita.json');

app.get('/berita', (req, res) => {
  res.render('berita', { beritas: beritaData });
});

app.get('/berita/:id', (req, res) => {
  const berita = beritaData.find(b => b.id == req.params.id);
  if (!berita) return res.status(404).send('Not found');
  res.render('berita-detail', { berita });
});

app.listen(PORT, () => {
  console.log(`Website jalan di http://localhost:${PORT}`);
});

