require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const path = require('path');

const mainRoutes = require('./routes/mainRoutes');  // Kalau ada
const adminRoutes = require('./routes/admin');  // Baru

const app = express();
const PORT = process.env.PORT || 3000;

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));

// Session
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false }  // true kalau HTTPS
}));

// MongoDB (kompatibel versi lama)
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB error:', err));

app.use('/', mainRoutes);
app.use('/admin', adminRoutes);

app.get('/', (req, res) => {
  const data = require('./data/home.json');
  res.render('beranda', { data });
});

// ROUTE PROFIL (SEMUA SUBMENU)
const profilPages = {
  sekolah: 'Profil Sekolah',
  sejarah: 'Sejarah Singkat',
  staff: 'Staf Pengajar',
  'visi-misi': 'Visi, Misi & Tujuan',
  'tenaga-kependidikan': 'Staf Tenaga Kependidikan',
  fasilitas: 'Fasilitas'
};

app.get('/profil/:page', (req, res) => {
  const page = req.params.page;
  const title = profilPages[page];
  if (!title) return res.status(404).send('Halaman tidak ditemukan');
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

