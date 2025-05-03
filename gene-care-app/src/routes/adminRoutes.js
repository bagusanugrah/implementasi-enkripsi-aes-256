const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const medicalRecordController = require('../controllers/medicalRecordController');

// Middleware untuk memastikan admin login
const isAdmin = (req, res, next) => {
    if (req.isAuthenticated() && req.user.is_admin) {
        return next();
    }
    res.redirect('/auth/login');
};

router.get('/dashboard', isAdmin, adminController.getAllUsers);
router.post('/medical-records/update', isAdmin, adminController.updateMedicalRecord);
router.post('/medical-records/delete', isAdmin, adminController.deleteMedicalRecord);

module.exports = router;