const express = require('express');
const router = express.Router();
const { registerInit, registerVerify, logout, getMe, sendOtp, verifyOtp, resetPassword } = require('../controllers/auth.controller');
const authenticate = require('../middleware/authenticate');
const validate = require('../middleware/validate');
const { registerSchema, registerVerifySchema, resetPasswordSchema, verifyOtpSchema } = require('../validators/auth.validator');
const { authLimiter } = require('../middleware/rateLimiter');

// Public routes (rate-limited)
router.post('/register-init', authLimiter, validate(registerSchema), registerInit);
router.post('/register-verify', authLimiter, validate(registerVerifySchema), registerVerify);
router.post('/send-otp', authLimiter, sendOtp);
router.post('/verify-otp', authLimiter, validate(verifyOtpSchema), verifyOtp);
router.post('/reset-password', authLimiter, validate(resetPasswordSchema), resetPassword);

// Protected routes
router.post('/logout', authenticate, logout);
router.get('/me', authenticate, getMe);

module.exports = router;

