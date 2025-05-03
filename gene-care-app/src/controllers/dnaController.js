const db = require('../config/database');
const { encrypt, decrypt } = require('../utils/cryptoHelper');

exports.getDNA = (req, res) => {
    const userId = req.user.id;

    db.query('SELECT * FROM dna_data WHERE user_id = ?', [userId], (err, results) => {
        if (err) throw err;

        const dna = results[0] ? { ...results[0], dna_string: decrypt(results[0].dna_string) } : null;

        res.render('user/dna', {
            user: req.user,
            dna,
        });
    });
};

exports.createDNA = (req, res) => {
    const { dna_string } = req.body;
    const userId = req.user.id;
    const encryptedDNA = encrypt(dna_string);

    db.query('INSERT INTO dna_data (user_id, dna_string) VALUES (?, ?)', [userId, encryptedDNA], (err) => {
        if (err) throw err;
        res.redirect('/user/dna');
    });
};

exports.updateDNA = (req, res) => {
    const { dna_string } = req.body;
    const userId = req.user.id;
    const encryptedDNA = encrypt(dna_string);

    db.query('UPDATE dna_data SET dna_string = ? WHERE user_id = ?', [encryptedDNA, userId], (err) => {
        if (err) throw err;
        res.redirect('/user/dna');
    });
};

exports.deleteDNA = (req, res) => {
    const userId = req.user.id;

    db.query('DELETE FROM dna_data WHERE user_id = ?', [userId], (err) => {
        if (err) throw err;
        res.redirect('/user/dna');
    });
};