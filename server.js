require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const csrf = require('csurf');
const helmet = require('helmet');
const path = require('path');
const multer = require('multer');

const app = express();

// === SECURITY ===
app.use(helmet({
  contentSecurityPolicy: false,
  crossOriginEmbedderPolicy: false
}));
app.disable('x-powered-by');

// === SESSION ===


app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({
    mongoUrl: process.env.MONGO_URI,
    collectionName: 'sessions'
  }),
  cookie: {
    maxAge: 1000 * 60 * 60 * 24,
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production'
  }
}));

// === CSRF PROTECTION ===
const csrfProtection = csrf({ cookie: false });

// === DATABASE ===
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => {
    console.error('MongoDB connection failed:', err);
    process.exit(1);
  });

// === MIDDLEWARE ===
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public'), {
  maxAge: '1d'
}));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// === MULTER (UPLOAD FOTO) ===
const upload = multer({
  dest: 'public/uploads/',
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (req, file, cb) => {
    if (!file.mimetype.startsWith('image/')) {
      return cb(new Error('Hanya file gambar yang diperbolehkan!'));
    }
    cb(null, true);
  }
});

// === ROUTES ===
app.use('/', require('./routes/mainRoutes'));
app.use('/admin', csrfProtection, upload.single('foto'), require('./routes/admin'));
app.use('/admin', csrfProtection, require('./routes/adminBerita'));

// === ERROR HANDLER ===
app.use((err, req, res, next) => {
  console.error('Server Error:', err);
  if (err.code === 'EBADCSRFTOKEN') {
    return res.status(403).send('Invalid CSRF token. Silakan refresh halaman.');
  }
  if (err.message.includes('file')) {
    return res.status(400).send(err.message);
  }
  res.status(500).send('Terjadi kesalahan server. Silakan coba lagi nanti.');
});

// === 404 HANDLER ===
app.use((req, res) => {
  res.status(404).render('404', { title: 'Halaman Tidak Ditemukan' });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server berjalan di http://localhost:${PORT}`);
});