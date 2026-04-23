import React from 'react';
import { motion } from 'framer-motion';
import { MdNotifications, MdEvent, MdPersonAdd, MdCheckCircle } from 'react-icons/md';

const ActivityFeed = ({ activities = [] }) => {
  const getIcon = (type) => {
    switch (type) {
      case 'appointment': return <MdEvent className="text-accent" />;
      case 'patient': return <MdPersonAdd className="text-info" />;
      case 'completion': return <MdCheckCircle className="text-success" />;
      default: return <MdNotifications className="text-muted" />;
    }
  };

  return (
    <div className="activity-feed">
      <div className="feed-header">
        <h3 className="feed-title">Live Activity</h3>
        <span className="live-indicator">
          <span className="dot"></span>
          Live
        </span>
      </div>
      
      <div className="feed-content">
        {activities.length === 0 ? (
          <p className="empty-msg">No recent activity detected.</p>
        ) : (
          <div className="feed-list">
            {activities.map((item, index) => (
              <motion.div 
                key={item.id || index}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="feed-item"
              >
                <div className="item-icon">
                  {getIcon(item.type)}
                </div>
                <div className="item-details">
                  <p className="item-text">{item.message}</p>
                  <span className="item-time">{item.time}</span>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      <style jsx>{`
        .activity-feed {
          background: var(--color-bg-card);
          border: 1px solid var(--color-border);
          border-radius: var(--radius-lg);
          padding: var(--space-5);
          height: 100%;
          display: flex;
          flex-direction: column;
        }
        .feed-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: var(--space-4);
        }
        .feed-title {
          font-size: var(--fs-lg);
          font-weight: var(--fw-bold);
          color: var(--color-text-primary);
        }
        .live-indicator {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: var(--fs-xs);
          color: var(--color-success);
          text-transform: uppercase;
          font-weight: var(--fw-bold);
          letter-spacing: 1px;
        }
        .dot {
          width: 8px;
          height: 8px;
          background: var(--color-success);
          border-radius: 50%;
          box-shadow: 0 0 8px var(--color-success);
          animation: pulse 2s infinite;
        }
        @keyframes pulse {
          0% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.5); opacity: 0.5; }
          100% { transform: scale(1); opacity: 1; }
        }
        .feed-list {
          display: flex;
          flex-direction: column;
          gap: var(--space-4);
        }
        .feed-item {
          display: flex;
          gap: var(--space-3);
          align-items: flex-start;
          padding-bottom: var(--space-3);
          border-bottom: 1px solid rgba(255, 255, 255, 0.05);
        }
        .feed-item:last-child {
          border-bottom: none;
        }
        .item-icon {
          width: 32px;
          height: 32px;
          border-radius: var(--radius-md);
          background: rgba(255, 255, 255, 0.03);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 18px;
          flex-shrink: 0;
        }
        .item-text {
          font-size: var(--fs-sm);
          color: var(--color-text-secondary);
          margin-bottom: 2px;
          line-height: 1.4;
        }
        .item-time {
          font-size: var(--fs-xs);
          color: var(--color-text-muted);
        }
        .empty-msg {
          color: var(--color-text-muted);
          text-align: center;
          font-size: var(--fs-sm);
          margin-top: var(--space-4);
        }
      `}</style>
    </div>
  );
};

export default ActivityFeed;
