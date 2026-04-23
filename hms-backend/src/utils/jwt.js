const jwt = require('jsonwebtoken');
const env = require('../config/env');

/**
 * Generate an access token (short-lived, 15 minutes)
 */
const generateAccessToken = (payload) => {
  return jwt.sign(payload, env.jwtAccessSecret, { expiresIn: '15m' });
};

/**
 * Generate a refresh token (long-lived, 7 days)
 */
const generateRefreshToken = (payload) => {
  return jwt.sign(payload, env.jwtRefreshSecret, { expiresIn: '7d' });
};

/**
 * Verify an access token
 */
const verifyAccessToken = (token) => {
  return jwt.verify(token, env.jwtAccessSecret);
};

/**
 * Verify a refresh token
 */
const verifyRefreshToken = (token) => {
  return jwt.verify(token, env.jwtRefreshSecret);
};

/**
 * Cookie options for access token
 */
const accessTokenCookieOptions = () => ({
  httpOnly: true,
  secure: env.isProduction,
  sameSite: env.isProduction ? 'none' : 'lax',
  maxAge: 15 * 60 * 1000, // 15 minutes
  path: '/',
});

/**
 * Cookie options for refresh token
 */
const refreshTokenCookieOptions = () => ({
  httpOnly: true,
  secure: env.isProduction,
  sameSite: env.isProduction ? 'none' : 'lax',
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  path: '/api/v1/auth',
});

module.exports = {
  generateAccessToken,
  generateRefreshToken,
  verifyAccessToken,
  verifyRefreshToken,
  accessTokenCookieOptions,
  refreshTokenCookieOptions,
};
