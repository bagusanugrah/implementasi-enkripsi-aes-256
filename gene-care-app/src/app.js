const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const passport = require('./config/passport');
const db = require('./config/database');
const flash = require('connect-flash');
require('dotenv').config();
const { initializeAESKey } = require('./utils/cryptoHelper');

const app = express();

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));
app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');

// Session
app.use(
    session({
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: false,
    })
);

// Passport
app.use(passport.initialize());
app.use(passport.session());

// Routes
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const adminRoutes = require('./routes/adminRoutes');

// Middleware Flash
app.use(flash());

// Tambahkan pesan flash ke res.locals agar tersedia di semua view
app.use((req, res, next) => {
    res.locals.errorMessage = req.flash('error');
    res.locals.successMessage = req.flash('success');
    next();
});

app.get('/', (req, res) => {
    res.redirect('/auth/login'); // Redirect ke halaman login
});
app.use('/auth', authRoutes);
app.use('/user', userRoutes);
app.use('/admin', adminRoutes);

// Start server
const PORT = process.env.PORT || 3000;
// Inisialisasi kunci AES sebelum server berjalan
initializeAESKey()
    .then(() => {
        console.log('AES key initialized successfully');
        // Jalankan server setelah kunci AES berhasil diinisialisasi
        app.listen(process.env.PORT || 3000, () => {
            console.log(`Server is running on port ${process.env.PORT || 3000}`);
        });
    })
    .catch((error) => {
        console.error('Failed to initialize AES key:', error);
        process.exit(1); // Keluar jika inisialisasi gagal
    });