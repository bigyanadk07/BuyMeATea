const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { validateToken } = require('../middleware/authMiddleware');

// Public routes
router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/forgot-password', authController.forgotPassword);
router.post('/reset-password/:token', authController.resetPassword);

// Protected routes (require authentication)
router.get('/me', validateToken, authController.getMe); 
router.put('/update-profile', validateToken, authController.updateProfile);
router.put('/change-password', validateToken, authController.changePassword);
router.post('/logout', validateToken, authController.logout);
router.delete('/delete-account', validateToken, authController.deleteAccount);

module.exports = router;