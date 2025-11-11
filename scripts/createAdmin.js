require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });

const hashed = bcrypt.hashSync(process.env.ADMIN_PASSWORD, 10);
console.log('Admin dibuat: username:', process.env.ADMIN_USERNAME, 'password:', process.env.ADMIN_PASSWORD);
process.exit(0);