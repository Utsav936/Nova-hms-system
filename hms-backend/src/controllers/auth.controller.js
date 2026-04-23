const catchAsync = require('../utils/catchAsync');
const authService = require('../services/auth.service');

/**
 * POST /api/v1/auth/register-init
 */
const registerInit = catchAsync(async (req, res) => {
  const result = await authService.registerInit(req.body);

  res.status(200).json({
    status: 'success',
    message: result.message,
    data: { otp_for_testing: result.otp_for_testing }
  });
});

/**
 * POST /api/v1/auth/register-verify
 */
const registerVerify = catchAsync(async (req, res) => {
  const { user, customToken, message } = await authService.registerVerify(req.body);

  res.status(201).json({
    status: 'success',
    message: message,
    data: { user, customToken },
  });
});

/**
 * POST /api/v1/auth/send-otp
 */
const sendOtp = catchAsync(async (req, res) => {
  const result = await authService.sendOtp(req.body);
  res.status(200).json({
    status: 'success',
    message: result.message,
    data: { otp_for_testing: result.otp_for_testing }
  });
});

/**
 * POST /api/v1/auth/verify-otp
 */
const verifyOtp = catchAsync(async (req, res) => {
  const { user, customToken } = await authService.verifyOtp(req.body);

  res.status(200).json({
    status: 'success',
    message: 'OTP verified successfully',
    data: { user, customToken },
  });
});

/**
 * POST /api/v1/auth/logout
 */
const logout = catchAsync(async (req, res) => {
  await authService.logout(req.user.id);

  res.status(200).json({
    status: 'success',
    message: 'Logged out successfully',
  });
});

/**
 * GET /api/v1/auth/me
 */
const getMe = catchAsync(async (req, res) => {
  const user = await authService.getMe(req.user.id);

  res.status(200).json({
    status: 'success',
    data: { user },
  });
});

/**
 * POST /api/v1/auth/reset-password
 */
const resetPassword = catchAsync(async (req, res) => {
  const result = await authService.resetPassword(req.body);

  res.status(200).json({
    status: 'success',
    message: result.message,
  });
});

module.exports = { registerInit, registerVerify, logout, getMe, sendOtp, verifyOtp, resetPassword };

