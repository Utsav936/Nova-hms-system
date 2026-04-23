import { createContext, useContext, useState, useCallback } from 'react';

const ToastContext = createContext(null);

let toastId = 0;

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = 'info', duration = 4000) => {
    const id = ++toastId;
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, duration);
  }, []);

  const success = useCallback((msg) => addToast(msg, 'success'), [addToast]);
  const error = useCallback((msg) => addToast(msg, 'error'), [addToast]);
  const warning = useCallback((msg) => addToast(msg, 'warning'), [addToast]);
  const info = useCallback((msg) => addToast(msg, 'info'), [addToast]);

  return (
    <ToastContext.Provider value={{ success, error, warning, info }}>
      {children}
      {/* Toast Container */}
      <div className="toast-container">
        {toasts.map((toast) => (
          <div key={toast.id} className={`toast toast-${toast.type}`}>
            <span className="toast-icon">
              {toast.type === 'success' && '✓'}
              {toast.type === 'error' && '✕'}
              {toast.type === 'warning' && '⚠'}
              {toast.type === 'info' && 'ℹ'}
            </span>
            <span className="toast-message">{toast.message}</span>
          </div>
        ))}
      </div>

      <style>{`
        .toast-container {
          position: fixed;
          top: var(--space-6);
          right: var(--space-6);
          z-index: 10000;
          display: flex;
          flex-direction: column;
          gap: var(--space-3);
          pointer-events: none;
        }
        .toast {
          display: flex;
          align-items: center;
          gap: var(--space-3);
          padding: var(--space-3) var(--space-5);
          border-radius: var(--radius-md);
          background: var(--color-bg-card);
          border: 1px solid var(--color-border);
          color: var(--color-text-primary);
          font-size: var(--fs-base);
          font-weight: var(--fw-medium);
          box-shadow: var(--shadow-lg);
          animation: slideInRight 0.3s ease, fadeOut 0.3s ease 3.5s forwards;
          pointer-events: auto;
          min-width: 280px;
          backdrop-filter: blur(12px);
        }
        .toast-icon {
          font-size: var(--fs-md);
          width: 24px;
          height: 24px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: var(--radius-full);
          flex-shrink: 0;
        }
        .toast-success { border-color: var(--color-success); }
        .toast-success .toast-icon { background: var(--color-success-soft); color: var(--color-success); }
        .toast-error { border-color: var(--color-danger); }
        .toast-error .toast-icon { background: var(--color-danger-soft); color: var(--color-danger); }
        .toast-warning { border-color: var(--color-warning); }
        .toast-warning .toast-icon { background: var(--color-warning-soft); color: var(--color-warning); }
        .toast-info { border-color: var(--color-accent); }
        .toast-info .toast-icon { background: var(--color-accent-soft); color: var(--color-accent); }
        @keyframes fadeOut {
          to { opacity: 0; transform: translateX(20px); }
        }
      `}</style>
    </ToastContext.Provider>
  );
}

export const useToast = () => {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within ToastProvider');
  return ctx;
};
