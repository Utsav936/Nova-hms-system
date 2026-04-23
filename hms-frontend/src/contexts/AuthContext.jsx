import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { 
  onAuthStateChanged, 
  signInWithEmailAndPassword, 
  signInWithCustomToken,
  signOut,
  getIdTokenResult
} from 'firebase/auth';
import { auth } from '../config/firebase';
import authService from '../services/authService';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Real-time Auth Listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          // Get the latest claims (roles)
          const tokenResult = await getIdTokenResult(firebaseUser, true);
          const role = tokenResult.claims.role || 'patient';

          // Fetch additional profile data from our backend (with retry for eventual consistency)
          let userData = null;
          let attempts = 0;
          while (attempts < 3 && !userData) {
            try {
              const res = await authService.getMe();
              userData = res.data.data.user;
            } catch (err) {
              attempts++;
              if (attempts < 3) await new Promise(r => setTimeout(r, 1000)); // Wait 1s before retry
              else throw err;
            }
          }
          
          if (userData) {
            setUser({
              ...userData,
              uid: firebaseUser.uid,
              email: firebaseUser.email,
              role: role
            });
          }
        } catch (error) {
          console.error('Error fetching profile:', error);
          setUser(null);
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });


    return () => unsubscribe();
  }, []);

  const login = useCallback(async ({ email, password }) => {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    // onAuthStateChanged will handle the state update
    return userCredential.user;
  }, []);

  const registerInit = useCallback(async (data) => {
    const res = await authService.registerInit(data);
    return res.data;
  }, []);

  const registerVerify = useCallback(async (data) => {
    const res = await authService.registerVerify(data);
    const { customToken } = res.data.data;
    
    if (customToken) {
      await signInWithCustomToken(auth, customToken);
    }
    
    return res.data;
  }, []);

  const resetPassword = useCallback(async (data) => {
    const res = await authService.resetPassword(data);
    return res.data;
  }, []);

  const sendOtp = useCallback(async (data) => {
    const res = await authService.sendOtp(data);
    return res.data;
  }, []);

  const verifyOtp = useCallback(async (data) => {
    const res = await authService.verifyOtp(data);
    const { customToken } = res.data.data;

    if (customToken) {
      await signInWithCustomToken(auth, customToken);
    }

    return res.data;
  }, []);

  const logout = useCallback(async () => {
    await signOut(auth);
    setUser(null);
  }, []);

  const value = {
    user,
    loading,
    login,
    sendOtp,
    verifyOtp,
    registerInit,
    registerVerify,
    resetPassword,
    logout,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'admin',
    isDoctor: user?.role === 'doctor',
    isReceptionist: user?.role === 'receptionist',
    isPatient: user?.role === 'patient',
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};

