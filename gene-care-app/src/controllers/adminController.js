const db = require('../config/database');
const { encrypt, decrypt } = require('../utils/cryptoHelper');

exports.getDashboard = (req, res) => {
    // Ambil semua data DNA dan pengguna
    db.query(
        'SELECT dna_data.id, dna_data.dna_string, users.username FROM dna_data JOIN users ON dna_data.user_id = users.id',
        (err, dnaResults) => {
            if (err) throw err;

            res.render('admin/dashboard', {
                admin: req.user,
                dnaData: dnaResults,
            });
        }
    );
};

exports.getAllUsers = (req, res) => {
    db.query(
        `SELECT users.id AS user_id, users.username, dna_data.dna_string, medical_records.record
         FROM users
         LEFT JOIN dna_data ON users.id = dna_data.user_id
         LEFT JOIN medical_records ON users.id = medical_records.user_id
         WHERE users.is_admin = FALSE`,
        (err, results) => {
            if (err) throw err;

            const users = results.map(user => ({
                ...user,
                dna_string: user.dna_string ? decrypt(user.dna_string) : null,
                record: user.record ? decrypt(user.record) : null,
            }));

            res.render('admin/dashboard', {
                admin: req.user,
                users,
            });
        }
    );
};

exports.updateMedicalRecord = (req, res) => {
    const { user_id, record } = req.body;
    const encryptedRecord = encrypt(record);

    db.query(
        'INSERT INTO medical_records (user_id, record) VALUES (?, ?) ON DUPLICATE KEY UPDATE record = ?',
        [user_id, encryptedRecord, encryptedRecord],
        (err) => {
            if (err) throw err;
            res.redirect('/admin/dashboard');
        }
    );
};

exports.deleteMedicalRecord = (req, res) => {
    const { user_id } = req.body;

    db.query('DELETE FROM medical_records WHERE user_id = ?', [user_id], (err) => {
        if (err) throw err;
        res.redirect('/admin/dashboard');
    });
};