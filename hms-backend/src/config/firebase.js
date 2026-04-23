const admin = require('firebase-admin');
const dotenv = require('dotenv');

dotenv.config();

let serviceAccount;
let initialized = false;

try {
  if (process.env.FIREBASE_SERVICE_ACCOUNT) {
    serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
  } else {
    serviceAccount = require('../../serviceAccountKey.json');
  }

  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
  console.log('✅ Firebase Admin SDK initialized');
  initialized = true;
} catch (error) {
  console.error('❌ Firebase initialization error:', error.message);
  console.warn('⚠️ Server running in "NO-DATABASE" mode. Please provide serviceAccountKey.json.');
}

// Ensure we don't crash when calling db/auth if not initialized
const db = initialized ? admin.firestore() : null;
const auth = initialized ? admin.auth() : null;

module.exports = { admin, db, auth, initialized };

