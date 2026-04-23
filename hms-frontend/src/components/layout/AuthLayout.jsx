import { Outlet } from 'react-router-dom';

export default function AuthLayout() {
  return (
    <div className="auth-layout">
      <div className="auth-container">
        <div className="auth-brand animate-fade-in">
          <div className="auth-logo">Nova<span>HMS</span></div>
          <p className="auth-tagline">Premium Healthcare Management</p>
        </div>
        <div className="auth-content">
          <Outlet />
        </div>
      </div>
      <div className="auth-background"></div>

      <style>{`
        .auth-layout {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          background-color: var(--color-bg-primary);
          overflow: hidden;
        }
        
        .auth-background {
          position: absolute;
          inset: 0;
          background: 
            radial-gradient(circle at 15% 50%, rgba(99, 102, 241, 0.15), transparent 25%),
            radial-gradient(circle at 85% 30%, rgba(16, 185, 129, 0.1), transparent 25%);
          z-index: 0;
          pointer-events: none;
        }

        .auth-container {
          position: relative;
          z-index: 1;
          width: 100%;
          max-width: 440px;
          padding: var(--space-6);
        }

        .auth-brand {
          text-align: center;
          margin-bottom: var(--space-8);
        }

        .auth-logo {
          font-size: var(--fs-3xl);
          font-weight: var(--fw-bold);
          color: var(--color-text-primary);
          letter-spacing: -0.5px;
        }

        .auth-logo span {
          color: var(--color-accent);
        }

        .auth-tagline {
          color: var(--color-text-secondary);
          font-size: var(--fs-sm);
          margin-top: var(--space-2);
          text-transform: uppercase;
          letter-spacing: 1px;
        }

        .auth-content {
          background: var(--color-bg-card);
          border-radius: var(--radius-xl);
          border: 1px solid var(--color-border);
          box-shadow: var(--shadow-xl);
          padding: var(--space-8);
          backdrop-filter: blur(12px);
          animation: slideInUp 0.5s ease backwards;
          animation-delay: 0.1s;
        }
      `}</style>
    </div>
  );
}
