import React from 'react';
import { motion } from 'framer-motion';
import { MdAdd, MdEvent, MdDescription, MdSettings } from 'react-icons/md';

const QuickActions = ({ actions = [] }) => {
  return (
    <div className="quick-actions-grid">
      {actions.map((action, index) => (
        <motion.button
          key={index}
          whileHover={{ y: -4, scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={action.onClick}
          className="action-btn"
        >
          <div className="action-icon-wrap" style={{ backgroundColor: action.color || 'var(--color-accent-soft)' }}>
            {action.icon}
          </div>
          <div className="action-info">
            <span className="action-label">{action.label}</span>
            <span className="action-desc">{action.description}</span>
          </div>
        </motion.button>
      ))}

      <style jsx>{`
        .quick-actions-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: var(--space-4);
          margin-bottom: var(--space-6);
        }
        .action-btn {
          background: var(--color-bg-card);
          border: 1px solid var(--color-border);
          border-radius: var(--radius-lg);
          padding: var(--space-4);
          display: flex;
          align-items: center;
          gap: var(--space-4);
          cursor: pointer;
          text-align: left;
          transition: all 0.3s ease;
        }
        .action-btn:hover {
          border-color: var(--color-accent);
          box-shadow: 0 8px 24px -8px rgba(0,0,0,0.5);
        }
        .action-icon-wrap {
          width: 48px;
          height: 48px;
          border-radius: var(--radius-md);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 24px;
          color: var(--color-text-primary);
          flex-shrink: 0;
        }
        .action-info {
          display: flex;
          flex-direction: column;
        }
        .action-label {
          font-weight: var(--fw-bold);
          color: var(--color-text-primary);
          font-size: var(--fs-base);
        }
        .action-desc {
          font-size: var(--fs-xs);
          color: var(--color-text-secondary);
          margin-top: 2px;
        }
      `}</style>
    </div>
  );
};

export default QuickActions;
