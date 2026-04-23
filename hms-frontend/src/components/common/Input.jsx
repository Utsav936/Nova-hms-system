import { forwardRef } from 'react';

const Input = forwardRef(({ 
  label, 
  error, 
  icon, 
  id,
  fullWidth = true,
  className = '', 
  ...props 
}, ref) => {
  const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;

  return (
    <div className={`input-group ${fullWidth ? 'w-full' : ''} ${className}`}>
      {label && <label htmlFor={inputId} className="input-label">{label}</label>}
      <div className="input-wrapper">
        {icon && <span className="input-icon">{icon}</span>}
        <input
          ref={ref}
          id={inputId}
          className={`input-field ${error ? 'input-error' : ''} ${icon ? 'has-icon' : ''}`}
          {...props}
        />
      </div>
      {error && <p className="input-error-msg animate-fade-in">{error}</p>}

      <style>{`
        .input-group {
          display: flex;
          flex-direction: column;
          margin-bottom: var(--space-4);
        }

        .input-label {
          font-size: var(--fs-sm);
          font-weight: var(--fw-medium);
          color: var(--color-text-secondary);
          margin-bottom: var(--space-2);
        }

        .input-wrapper {
          position: relative;
          display: flex;
          align-items: center;
        }

        .input-icon {
          position: absolute;
          left: var(--space-3);
          color: var(--color-text-muted);
          display: flex;
        }

        .input-field {
          width: 100%;
          background: var(--color-bg-input);
          border: 1px solid var(--color-border);
          border-radius: var(--radius-md);
          padding: var(--space-3) var(--space-4);
          color: var(--color-text-primary);
          font-size: var(--fs-base);
          transition: all var(--transition-fast);
        }

        .input-field.has-icon {
          padding-left: var(--space-10);
        }

        .input-field:focus {
          border-color: var(--color-accent);
          box-shadow: 0 0 0 3px var(--color-accent-soft);
        }

        .input-field.input-error {
          border-color: var(--color-danger);
        }
        .input-field.input-error:focus {
          box-shadow: 0 0 0 3px var(--color-danger-soft);
        }

        .input-field:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .input-error-msg {
          color: var(--color-danger);
          font-size: var(--fs-xs);
          margin-top: var(--space-1);
        }
      `}</style>
    </div>
  );
});

Input.displayName = 'Input';

export default Input;
