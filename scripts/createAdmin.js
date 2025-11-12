// scripts/createAdmin.js
require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

async function createAdmin() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB Atlas');

    const username = 'admin';
    const password = 'admin123'; // Ganti nanti di admin panel

    const existingUser = await User.findOne({ username });
    if (existingUser) {
      console.log(`Admin "${username}" sudah ada.`);
      process.exit(0);
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const admin = new User({
      username,
      password: hashedPassword,
      role: 'admin'
    });

    await admin.save();
    console.log(`Admin berhasil dibuat!`);
    console.log(`Username: ${username}`);
    console.log(`Password: ${password}`);
    console.log(`\nLogin di: http://localhost:3001/admin/login`);
    console.log(`Ganti password segera!`);
    
    process.exit(0);
  } catch (err) {
    console.error('Error:', err.message);
    process.exit(1);
  }
}

createAdmin();