import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import Input from '../components/common/Input';
import Button from '../components/common/Button';
import { MdEmail, MdVpnKey, MdLock } from 'react-icons/md';

export default function ForgotPassword() {
  const navigate = useNavigate();
  const { sendOtp, resetPassword } = useAuth();
  const { success, error } = useToast();
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');

  const handleSendOtp = async (e) => {
    e.preventDefault();
    if (!email) {
      error('Please enter your email address.');
      return;
    }
    setLoading(true);
    try {
      const res = await sendOtp({ identifier: email });
      success(res.message || 'OTP sent successfully.');
      setStep(2);
    } catch (err) {
      error(err.response?.data?.message || 'Failed to send OTP.');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (!otp || otp.length !== 6) {
      error('Please enter a valid 6-digit OTP.');
      return;
    }
    if (newPassword.length < 8) {
      error('Password must be at least 8 characters long.');
      return;
    }
    setLoading(true);
    try {
      await resetPassword({ email, otp, newPassword });
      success('Password reset successfully. You can now log in.');
      navigate('/login');
    } catch (err) {
      error(err.response?.data?.message || 'Failed to reset password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="forgot-password-page">
      <div className="auth-header">
        <h2>Reset Password</h2>
        <p>{step === 1 ? 'Enter your email to receive an OTP' : 'Enter OTP and create a new password'}</p>
      </div>

      {step === 1 ? (
        <form onSubmit={handleSendOtp} className="auth-form animate-fade-in">
          <Input
            label="Email Address"
            type="email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            icon={<MdEmail />}
            placeholder="you@example.com"
          />

          <div className="auth-actions">
            <Button type="submit" fullWidth loading={loading}>
              Send OTP
            </Button>
          </div>
        </form>
      ) : (
        <form onSubmit={handleResetPassword} className="auth-form animate-slide-up">
          <p className="text-sm text-secondary mb-4">
            Code sent to <strong>{email}</strong>.{' '}
            <button type="button" onClick={() => setStep(1)} className="text-accent hover:underline bg-transparent border-none cursor-pointer">
              Change Email
            </button>
          </p>

          <Input
            label="6-Digit OTP"
            type="text"
            name="otp"
            value={otp}
            onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').substring(0, 6))}
            required
            icon={<MdVpnKey />}
            placeholder="000000"
            style={{ fontSize: '1.5rem', letterSpacing: '0.5rem', textAlign: 'center' }}
          />

          <Input
            label="New Password"
            type="password"
            name="newPassword"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
            icon={<MdLock />}
            placeholder="••••••••"
          />

          <div className="auth-actions">
            <Button type="submit" fullWidth loading={loading}>
              Reset Password
            </Button>
          </div>
        </form>
      )}

      <div className="auth-footer">
        <p>Remembered your password? <Link to="/login">Sign In</Link></p>
      </div>

      <style>{`
        .auth-header {
          margin-bottom: var(--space-6);
        }
        .auth-header h2 {
          color: var(--color-text-primary);
          font-size: var(--fs-2xl);
          margin-bottom: var(--space-1);
        }
        .auth-header p {
          color: var(--color-text-secondary);
        }
        .auth-form {
          display: flex;
          flex-direction: column;
          gap: var(--space-3);
        }
        .auth-actions {
          margin-top: var(--space-4);
        }
        .auth-footer {
          margin-top: var(--space-6);
          text-align: center;
          font-size: var(--fs-sm);
        }
      `}</style>
    </div>
  );
}
