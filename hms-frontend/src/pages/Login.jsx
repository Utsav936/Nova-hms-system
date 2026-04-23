import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import Input from '../components/common/Input';
import Button from '../components/common/Button';
import { MdEmail, MdLock } from 'react-icons/md';

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { success, error } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ email: '', password: '' });

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(formData);
      success('Welcome back to Nova HMS!');
      navigate('/');
    } catch (err) {
      error(err.response?.data?.message || 'Invalid email or password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="auth-header">
        <h2>Secure Sign In</h2>
        <p>Login with your credentials</p>
      </div>

      <form onSubmit={handleLogin} className="auth-form animate-fade-in">
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

        <div className="password-wrapper">
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
          <div className="forgot-password">
            <Link to="/forgot-password">Forgot Password?</Link>
          </div>
        </div>

        <div className="auth-actions">
          <Button type="submit" fullWidth loading={loading}>
            Sign In
          </Button>
        </div>
      </form>

      <div className="auth-footer">
        <p>Don't have an account? <Link to="/register">Register as Patient</Link></p>
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
        .password-wrapper {
          display: flex;
          flex-direction: column;
        }
        .forgot-password {
          text-align: right;
          margin-top: 0.25rem;
          font-size: var(--fs-sm);
        }
        .forgot-password a {
          color: var(--color-primary);
          text-decoration: none;
        }
        .forgot-password a:hover {
          text-decoration: underline;
        }
        .auth-actions {
          margin-top: var(--space-2);
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
