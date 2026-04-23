const { auth, db } = require('../config/firebase');
const ApiError = require('../utils/ApiError');

class AuthService {
  /**
   * Register a new patient user (Init)
   */
  async registerInit({ email, password, first_name, last_name }) {
    // In Firebase, we can check if user exists
    try {
      await auth.getUserByEmail(email);
      throw ApiError.conflict('An account with this email already exists.');
    } catch (error) {
      if (error.code !== 'auth/user-not-found') throw error;
    }

    // Generate real secure 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

    await db.collection('registration_temp').doc(email).set({
      email,
      password, // We store this temporarily until verified (encrypted by Firebase eventually)
      first_name,
      last_name,
      otp_code: otp,
      otp_expires_at: expiresAt
    });

    // Dispatch Real OTP
    const { sendOTP } = require('../utils/notification');
    await sendOTP({ identifier: email, otp, type: 'email' });

    return { message: 'OTP sent successfully' };
  }

  /**
   * Register a new patient user (Verify)
   */
  async registerVerify({ email, otp }) {
    const tempDoc = await db.collection('registration_temp').doc(email).get();
    
    if (!tempDoc.exists) {
      throw ApiError.notFound('Registration session not found.');
    }

    const data = tempDoc.data();
    if (data.otp_code !== otp || new Date(data.otp_expires_at) < new Date()) {
      throw ApiError.unauthorized('Invalid or expired OTP.');
    }

    // Create user in Firebase Auth
    const userRecord = await auth.createUser({
      email: data.email,
      password: data.password,
      displayName: `${data.first_name} ${data.last_name}`,
    });

    // Set role
    await auth.setCustomUserClaims(userRecord.uid, { role: 'patient' });

    // Create user profile in Firestore
    const userProfile = {
      id: userRecord.uid,
      email: data.email,
      role: 'patient',
      first_name: data.first_name,
      last_name: data.last_name,
      is_active: true,
      created_at: new Date()
    };

    await db.collection('users').doc(userRecord.uid).set(userProfile);
    await db.collection('patients').doc(userRecord.uid).set({
      user_id: userRecord.uid,
      ...userProfile
    });

    // Clean up
    await db.collection('registration_temp').doc(email).delete();

    // Generate Firebase Custom Token
    const customToken = await auth.createCustomToken(userRecord.uid, { role: 'patient' });

    return { 
      user: userProfile, 
      customToken,
      message: 'Account verified and created successfully.' 
    };
  }

  /**
   * Login is mostly handled on the frontend with Firebase Web SDK.
   * This method can be used for server-side verification or custom login logic.
   */
  async verifyToken(idToken) {
    try {
      const decodedToken = await auth.verifyIdToken(idToken);
      const user = await db.collection('users').doc(decodedToken.uid).get();
      return { ...user.data(), ...decodedToken };
    } catch (error) {
      throw ApiError.unauthorized('Invalid token.');
    }
  }

  /**
   * Send OTP for Login/Reset
   */
  async sendOtp({ identifier }) {
    // identifier could be email
    const userSnapshot = await db.collection('users').where('email', '==', identifier).get();
    if (userSnapshot.empty) {
      throw ApiError.notFound('Account not found.');
    }

    const user = userSnapshot.docs[0].data();
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

    await db.collection('users').doc(user.id).update({
      otp_code: otp,
      otp_expires_at: expiresAt
    });

    // Dispatch Real OTP
    const { sendOTP } = require('../utils/notification');
    await sendOTP({ identifier, otp, type: 'email' });

    return { message: 'OTP sent successfully' };
  }

  /**
   * Verify OTP for Login
   */
  async verifyOtp({ identifier, otp }) {
    const userSnapshot = await db.collection('users').where('email', '==', identifier).get();
    if (userSnapshot.empty) {
      throw ApiError.notFound('Account not found.');
    }

    const userDoc = userSnapshot.docs[0];
    const user = userDoc.data();

    if (user.otp_code !== otp || new Date(user.otp_expires_at) < new Date()) {
      throw ApiError.unauthorized('Invalid or expired OTP.');
    }

    // Clear OTP after successful verification
    await db.collection('users').doc(user.id).update({
      otp_code: null,
      otp_expires_at: null
    });

    // Generate Firebase Custom Token
    const customToken = await auth.createCustomToken(user.id, { role: user.role });

    return { user, customToken };
  }

  /**
   * Logout — handled client side by clearing tokens, but we can revoke tokens if needed
   */
  async logout(userId) {
    await auth.revokeRefreshTokens(userId);
  }

  /**
   * Reset Password
   */
  async resetPassword({ email, otp, newPassword }) {
    const userSnapshot = await db.collection('users').where('email', '==', email).get();
    if (userSnapshot.empty) {
      throw ApiError.notFound('Account not found.');
    }

    const userDoc = userSnapshot.docs[0];
    const user = userDoc.data();

    if (user.otp_code !== otp || new Date(user.otp_expires_at) < new Date()) {
      throw ApiError.unauthorized('Invalid or expired OTP.');
    }

    // Update Firebase Auth password
    await auth.updateUser(user.id, {
      password: newPassword
    });

    // Clear OTP
    await db.collection('users').doc(user.id).update({
      otp_code: null,
      otp_expires_at: null
    });

    return { message: 'Password updated successfully' };
  }

  /**
   * Get current user profile
   */
  async getMe(userId) {
    const userDoc = await db.collection('users').doc(userId).get();
    if (!userDoc.exists) throw ApiError.notFound('User not found.');

    const user = userDoc.data();
    
    if (user.role === 'doctor') {
      const doctorDoc = await db.collection('doctors').doc(userId).get();
      user.doctor_profile = doctorDoc.exists ? doctorDoc.data() : null;
    }

    if (user.role === 'patient') {
      const patientDoc = await db.collection('patients').doc(userId).get();
      user.patient_profile = patientDoc.exists ? patientDoc.data() : null;
    }

    return user;
  }
}

module.exports = new AuthService();

