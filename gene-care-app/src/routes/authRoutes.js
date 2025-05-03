const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');


const isGuest = (req, res, next) => {
    if (req.isAuthenticated()) {
        // Jika sudah login, arahkan ke dashboard
        return res.redirect(req.user.is_admin ? '/admin/dashboard' : '/user/dashboard');
    }
    next();
};


router.get('/login', isGuest, authController.getLogin);
router.post('/login', authController.postLogin);
router.get('/register', isGuest, authController.getRegister);
router.post('/register', authController.postRegister);
router.get('/logout', authController.logout);

module.exports = router;