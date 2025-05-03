const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const dnaController = require('../controllers/dnaController');

const isUser = (req, res, next) => {
    if (req.isAuthenticated() && !req.user.is_admin) {
        return next();
    }
    res.redirect('/auth/login');
};

router.get('/dashboard', isUser, userController.getDashboard);
router.get('/dna', isUser, dnaController.getDNA);
router.post('/dna', isUser, dnaController.createDNA);
router.post('/dna/update', isUser, dnaController.updateDNA);
router.post('/dna/delete', isUser, dnaController.deleteDNA);

module.exports = router;