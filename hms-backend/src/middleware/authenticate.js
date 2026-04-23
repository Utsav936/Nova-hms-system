const ApiError = require('../utils/ApiError');
const { auth } = require('../config/firebase');

/**
 * Middleware to authenticate requests via Firebase ID Tokens.
 * Expects 'Authorization: Bearer <token>' header.
 */
const authenticate = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    // Fallback to cookie for some flows, but Bearer is preferred
    const token = req.cookies?.accessToken || null;
    if (!token) {
      return next(ApiError.unauthorized('Access token missing. Please log in.'));
    }
    return verifyFirebaseToken(token, req, next);
  }

  const idToken = authHeader.split('Bearer ')[1];
  return verifyFirebaseToken(idToken, req, next);
};

const verifyFirebaseToken = async (token, req, next) => {
  try {
    const decodedToken = await auth.verifyIdToken(token);
    req.user = {
      id: decodedToken.uid,
      email: decodedToken.email,
      role: decodedToken.role || 'patient', // Role from Custom Claims
    };
    next();
  } catch (error) {
    console.error('Firebase Auth Error:', error.message);
    if (error.code === 'auth/id-token-expired') {
      return next(ApiError.unauthorized('Token expired. Please refresh.'));
    }
    return next(ApiError.unauthorized('Invalid authentication token.'));
  }
};

module.exports = authenticate;

