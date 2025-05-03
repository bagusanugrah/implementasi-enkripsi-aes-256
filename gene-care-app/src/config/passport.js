const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const db = require('./database');
const bcrypt = require('bcrypt');

// Strategi login menggunakan username dan password
passport.use(
    new LocalStrategy((username, password, done) => {
        db.query('SELECT * FROM users WHERE username = ?', [username], (err, results) => {
            if (err) return done(err);
            if (results.length === 0) return done(null, false, { message: 'Incorrect username.' });

            const user = results[0];
            bcrypt.compare(password, user.password, (err, isMatch) => {
                if (err) return done(err);
                if (isMatch) return done(null, user);
                return done(null, false, { message: 'Incorrect password.' });
            });
        });
    })
);

// Serialize user (menyimpan user.id ke sesi)
passport.serializeUser((user, done) => {
    done(null, user.id);
});

// Deserialize user (mengambil data user dari database berdasarkan user.id)
passport.deserializeUser((id, done) => {
    db.query('SELECT * FROM users WHERE id = ?', [id], (err, results) => {
        if (err) return done(err);
        if (results.length === 0) return done(null, false);
        done(null, results[0]);
    });
});

module.exports = passport;