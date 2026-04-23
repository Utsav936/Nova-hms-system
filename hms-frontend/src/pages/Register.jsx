import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import Input from '../components/common/Input';
import Button from '../components/common/Button';
import { MdEmail, MdLock, MdPerson, MdVpnKey } from 'react-icons/md';

export default function Register() {
  const navigate = useNavigate();
  const { registerInit, registerVerify } = useAuth();
  const { success, error } = useToast();
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({ 
    first_name: '', 
    last_name: '', 
    email: '', 
    password: '' 
  });
  const [otp, setOtp] = useState('');

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleInit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await registerInit(formData);
      success(res.message || 'OTP sent to your email.');
      setStep(2);
    } catch (err) {
      if (err.response?.data?.errors) {
        error(err.response.data.errors[0].message);
      } else {
        error(err.response?.data?.message || 'Registration failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    if (!otp || otp.length !== 6) {
      error('Please enter a valid 6-digit OTP.');
      return;
    }
    setLoading(true);
    try {
      await registerVerify({ email: formData.email, otp });
      success('Registration successful! Welcome to Nova HMS.');
      navigate('/dashboard', { replace: true });
    } catch (err) {
      error(err.response?.data?.message || 'Invalid OTP.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-page">
      <div className="auth-header">
        <h2>Create Account</h2>
        <p>{step === 1 ? 'Register as a new patient' : 'Verify your email address'}</p>
      </div>

      {step === 1 ? (
        <form onSubmit={handleInit} className="auth-form animate-fade-in">
          <div className="flex gap-4">
            <Input
              label="First Name"
              name="first_name"
              value={formData.first_name}
              onChange={handleChange}
              required
              icon={<MdPerson />}
              placeholder="John"
            />
            <Input
              label="Last Name"
              name="last_name"
              value={formData.last_name}
              onChange={handleChange}
              required
              icon={<MdPerson />}
              placeholder="Doe"
            />
          </div>

          <Input
            label="Email Address"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            icon={<MdEmail />}
            placeholder="you@example.com"
          />
          
          <Input
            label="Password"
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            icon={<MdLock />}
            placeholder="••••••••"
          />

          <div className="auth-actions">
            <Button type="submit" fullWidth loading={loading}>
              Continue
            </Button>
          </div>
        </form>
      ) : (
        <form onSubmit={handleVerify} className="auth-form animate-slide-up">
          <p className="text-sm text-secondary mb-4">
            Code sent to <strong>{formData.email}</strong>.{' '}
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

          <div className="auth-actions">
            <Button type="submit" fullWidth loading={loading}>
              Verify & Register
            </Button>
          </div>
        </form>
      )}

      <div className="auth-footer">
        <p>Already have an account? <Link to="/login">Sign In</Link></p>
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
        .flex {
          display: flex;
        }
        .gap-4 {
          gap: 1rem;
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
