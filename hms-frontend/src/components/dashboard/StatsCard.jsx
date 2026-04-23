export default function StatsCard({ title, value, icon, trend, colorClass = 'accent' }) {
  return (
    <div className={`stats-card border-${colorClass}`}>
      <div className="stats-icon-wrapper">
        <div className={`stats-icon bg-${colorClass}-soft text-${colorClass}`}>
          {icon}
        </div>
      </div>
      <div className="stats-info">
        <h4 className="stats-title">{title}</h4>
        <div className="stats-value-row">
          <span className="stats-value">{value}</span>
          {trend && (
            <span className={`stats-trend ${trend >= 0 ? 'text-success' : 'text-danger'}`}>
              {trend >= 0 ? '+' : ''}{trend}%
            </span>
          )}
        </div>
      </div>

      <style>{`
        .stats-card {
          background: var(--color-bg-card);
          border-radius: var(--radius-xl);
          padding: var(--space-5);
          display: flex;
          align-items: center;
          gap: var(--space-4);
          position: relative;
          overflow: hidden;
          box-shadow: var(--shadow-card);
          transition: transform var(--transition-base), box-shadow var(--transition-base);
        }

        .stats-card:hover {
          transform: translateY(-2px);
          box-shadow: var(--shadow-md);
        }

        /* Gradient Accent Strip */
        .stats-card::before {
          content: '';
          position: absolute;
          left: 0;
          top: 0;
          bottom: 0;
          width: 4px;
        }

        .stats-card.border-accent::before { background: var(--color-accent); }
        .stats-card.border-success::before { background: var(--color-success); }
        .stats-card.border-warning::before { background: var(--color-warning); }
        .stats-card.border-danger::before { background: var(--color-danger); }
        .stats-card.border-info::before { background: var(--color-info); }

        .stats-icon-wrapper {
          flex-shrink: 0;
        }

        .stats-icon {
          width: 56px;
          height: 56px;
          border-radius: var(--radius-lg);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: var(--fs-xl);
        }

        .bg-accent-soft { background: var(--color-accent-soft); }
        .bg-success-soft { background: var(--color-success-soft); }
        .bg-warning-soft { background: var(--color-warning-soft); }
        .bg-danger-soft { background: var(--color-danger-soft); }
        .bg-info-soft { background: var(--color-info-soft); }

        .stats-info {
          flex: 1;
        }

        .stats-title {
          font-size: var(--fs-sm);
          color: var(--color-text-secondary);
          font-weight: var(--fw-medium);
          text-transform: uppercase;
          letter-spacing: 0.5px;
          margin-bottom: var(--space-1);
        }

        .stats-value-row {
          display: flex;
          align-items: baseline;
          gap: var(--space-3);
        }

        .stats-value {
          font-size: var(--fs-3xl);
          font-weight: var(--fw-bold);
          color: var(--color-text-primary);
          line-height: 1;
        }

        .stats-trend {
          font-size: var(--fs-xs);
          font-weight: var(--fw-semibold);
          padding: 2px 6px;
          border-radius: var(--radius-full);
          background: rgba(255,255,255,0.05); /* Subtle background for trend */
        }
      `}</style>
    </div>
  );
}
