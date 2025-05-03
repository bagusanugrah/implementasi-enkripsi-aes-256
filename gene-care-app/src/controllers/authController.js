const bcrypt = require('bcrypt');
const db = require('../config/database');

exports.getLogin = (req, res) => {
    res.render('auth/login');
};

exports.postLogin = (req, res) => {
    const { username, password } = req.body;
    db.query('SELECT * FROM users WHERE username = ?', [username], (err, results) => {
        if (err || results.length === 0) {
            req.flash('error', 'Invalid username or password');
            return res.redirect('/auth/login');
        }
        const user = results[0];
        bcrypt.compare(password, user.password, (err, isMatch) => {
            if (isMatch) {
                req.login(user, (err) => {
                    if (err) {
                        req.flash('error', 'Login error. Please try again.');
                        return res.redirect('/auth/login');
                    }
                    res.redirect(user.is_admin ? '/admin/dashboard' : '/user/dashboard');
                });
            } else {
                req.flash('error', 'Invalid username or password');
                res.redirect('/auth/login');
            }
        });
    });
};

exports.getRegister = (req, res) => {
    res.render('auth/register');
};

exports.postRegister = (req, res) => {
    const { username, password } = req.body;

    // Periksa apakah username sudah ada
    db.query('SELECT * FROM users WHERE username = ?', [username], (err, results) => {
        if (err) throw err;

        if (results.length > 0) {
            // Username sudah terdaftar
            req.flash('error', 'Username is already taken');
            return res.redirect('/auth/register');
        }

        // Hash password dan simpan pengguna baru
        bcrypt.hash(password, 10, (err, hash) => {
            if (err) throw err;

            db.query('INSERT INTO users (username, password) VALUES (?, ?)', [username, hash], (err) => {
                if (err) throw err;
                req.flash('success', 'Registration successful! Please login.');
                res.redirect('/auth/login');
            });
        });
    });
};

exports.logout = (req, res) => {
    req.logout((err) => {
        if (err) {
            console.error('Logout error:', err);
            return res.redirect('/auth/login');
        }
        req.session.destroy(() => {
            res.redirect('/auth/login');
        });
    });
};