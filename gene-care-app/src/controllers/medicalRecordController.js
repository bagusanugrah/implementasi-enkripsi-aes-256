const db = require('../config/database');

exports.getAllRecords = (req, res) => {
    db.query(
        'SELECT medical_records.id, medical_records.record, users.username FROM medical_records JOIN users ON medical_records.user_id = users.id',
        (err, results) => {
            if (err) throw err;

            res.render('admin/medicalRecords', {
                admin: req.user,
                medicalRecords: results,
            });
        }
    );
};

exports.createRecord = (req, res) => {
    const { user_id, record } = req.body;

    db.query('INSERT INTO medical_records (user_id, record) VALUES (?, ?)', [user_id, record], (err) => {
        if (err) throw err;
        res.redirect('/admin/medical-records');
    });
};

exports.updateRecord = (req, res) => {
    const { record } = req.body;
    const recordId = req.params.id;

    db.query('UPDATE medical_records SET record = ? WHERE id = ?', [record, recordId], (err) => {
        if (err) throw err;
        res.redirect('/admin/medical-records');
    });
};

exports.deleteRecord = (req, res) => {
    const recordId = req.params.id;

    db.query('DELETE FROM medical_records WHERE id = ?', [recordId], (err) => {
        if (err) throw err;
        res.redirect('/admin/medical-records');
    });
};