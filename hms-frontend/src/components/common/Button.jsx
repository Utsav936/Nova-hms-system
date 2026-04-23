import { forwardRef } from 'react';

const Button = forwardRef(({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  fullWidth = false, 
  loading = false, 
  icon, 
  className = '', 
  ...props 
}, ref) => {
  const baseClasses = 'btn';
  const variantClasses = `btn-${variant}`;
  const sizeClasses = `btn-${size}`;
  const widthClass = fullWidth ? 'w-full' : '';
  const loadingClass = loading ? 'loading' : '';

  return (
    <button
      ref={ref}
      className={[baseClasses, variantClasses, sizeClasses, widthClass, loadingClass, className].filter(Boolean).join(' ')}
      disabled={loading || props.disabled}
      {...props}
    >
      {loading ? (
        <span className="btn-spinner" />
      ) : (
        <>
          {icon && <span className="btn-icon">{icon}</span>}
          {children}
        </>
      )}

      <style>{`
        .btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: var(--space-2);
          border-radius: var(--radius-md);
          font-weight: var(--fw-medium);
          transition: all var(--transition-base);
          position: relative;
          overflow: hidden;
        }

        .btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        /* Sizes */
        .btn-sm {
          padding: var(--space-2) var(--space-4);
          font-size: var(--fs-sm);
        }
        .btn-md {
          padding: var(--space-3) var(--space-6);
          font-size: var(--fs-base);
        }
        .btn-lg {
          padding: var(--space-4) var(--space-8);
          font-size: var(--fs-md);
        }

        /* Variants */
        .btn-primary {
          background: var(--color-accent);
          color: #fff;
          box-shadow: var(--shadow-md);
        }
        .btn-primary:hover:not(:disabled) {
          background: var(--color-accent-hover);
          transform: translateY(-1px);
        }

        .btn-secondary {
          background: var(--color-bg-card-hover);
          color: var(--color-text-primary);
          border: 1px solid var(--color-border);
        }
        .btn-secondary:hover:not(:disabled) {
          background: rgba(255,255,255,0.05);
          border-color: var(--color-border-hover);
        }

        .btn-danger {
          background: var(--color-danger);
          color: #fff;
        }
        .btn-danger:hover:not(:disabled) {
          background: #dc2626;
        }

        .btn-outline {
          background: transparent;
          color: var(--color-accent);
          border: 1px solid var(--color-border-accent);
        }
        .btn-outline:hover:not(:disabled) {
          background: var(--color-accent-soft);
        }

        .btn-spinner {
          width: 1rem;
          height: 1rem;
          border: 2px solid rgba(255,255,255,0.3);
          border-top-color: #fff;
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
        }

        .btn-icon {
          display: flex;
        }
      `}</style>
    </button>
  );
});

Button.displayName = 'Button';

export default Button;
