const db = require('../config/database');
const { decrypt } = require('../utils/cryptoHelper');

exports.getDashboard = (req, res) => {
    const userId = req.user.id;

    // Ambil data DNA dan catatan medis milik pengguna
    db.query('SELECT * FROM dna_data WHERE user_id = ?', [userId], (err, dnaResults) => {
        if (err) throw err;

        db.query('SELECT * FROM medical_records WHERE user_id = ?', [userId], (err, medicalResults) => {
            if (err) throw err;

            // Dekripsi data DNA
            const dnaData = dnaResults.map(dna => ({
                ...dna,
                dna_string: decrypt(dna.dna_string),
            }));

            // Dekripsi data rekam medis
            const medicalRecords = medicalResults.map(record => ({
                ...record,
                record: decrypt(record.record),
            }));

            res.render('user/dashboard', {
                user: req.user,
                dnaData,
                medicalRecords,
            });
        });
    });
};