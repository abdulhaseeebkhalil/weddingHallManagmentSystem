const express = require('express');
const router = express.Router();
const { register, login, getMe, refreshToken, changePassword } = require('../controllers/authController');
const protect = require('../middleware/auth');

router.post('/register', register);
router.post('/login', login);
router.get('/me', protect, getMe);
router.post('/refresh', refreshToken);
router.put('/change-password', protect, changePassword);

module.exports = router;
