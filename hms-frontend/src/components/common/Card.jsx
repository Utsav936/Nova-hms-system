export default function Card({ children, title, action, className = '', noPadding = false }) {
  return (
    <div className={`card ${className}`}>
      {(title || action) && (
        <div className="card-header">
          {title && <h3 className="card-title">{title}</h3>}
          {action && <div className="card-action">{action}</div>}
        </div>
      )}
      <div className={`card-body ${noPadding ? 'p-0' : ''}`}>
        {children}
      </div>

      <style>{`
        .card {
          background: var(--color-bg-card);
          border: 1px solid var(--color-border);
          border-radius: var(--radius-xl);
          box-shadow: var(--shadow-card);
          overflow: hidden;
          transition: transform var(--transition-base), box-shadow var(--transition-base);
        }

        .card:hover {
          box-shadow: var(--shadow-md);
          border-color: var(--color-border-hover);
        }

        .card-header {
          padding: var(--space-4) var(--space-6);
          border-bottom: 1px solid var(--color-border);
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .card-title {
          font-size: var(--fs-lg);
          font-weight: var(--fw-semibold);
          color: var(--color-text-primary);
        }

        .card-body {
          padding: var(--space-6);
        }

        .card-body.p-0 {
          padding: 0;
        }
      `}</style>
    </div>
  );
}
