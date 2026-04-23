import { useEffect, useRef } from 'react';
import { MdClose } from 'react-icons/md';

export default function NotificationBar({ notifications = [], onClose }) {
  const panelRef = useRef(null);

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (panelRef.current && !panelRef.current.contains(e.target)) {
        onClose();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose]);

  return (
    <div className="notification-bar" ref={panelRef}>
      <div className="notification-header">
        <h3 className="title">New Appointments</h3>
        <button className="close-btn" onClick={onClose} aria-label="Close">
          <MdClose size={20} />
        </button>
      </div>
      <ul className="notification-list">
        {notifications.length === 0 && <li className="empty">No new appointments</li>}
        {notifications.map((apt) => (
          <li key={apt.id} className="notification-item">
            <div className="info">
              <span className="date">{new Date(apt.appointment_date).toLocaleDateString()}</span>
              <span className="time">{apt.appointment_time?.substring(0,5)}</span>
            </div>
            <div className="details">
              <span className="patient">{apt.patient_first_name} {apt.patient_last_name}</span>
              <span className="type">{apt.type.replace('_', ' ')}</span>
            </div>
          </li>
        ))}
      </ul>
      <style>{`
        .notification-bar {
          position: absolute;
          top: calc(var(--header-height) + var(--space-2));
          right: var(--space-6);
          width: 300px;
          max-height: 400px;
          background: var(--color-bg-card);
          border: 1px solid var(--color-border);
          border-radius: var(--radius-md);
          box-shadow: var(--shadow-lg);
          z-index: 9999;
          display: flex;
          flex-direction: column;
          overflow: hidden;
        }
        .notification-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: var(--space-3) var(--space-4);
          border-bottom: 1px solid var(--color-border);
        }
        .title { font-size: var(--fs-sm); font-weight: var(--fw-medium); color: var(--color-text-primary); }
        .close-btn { background: transparent; border: none; color: var(--color-text-muted); cursor: pointer; }
        .notification-list { list-style: none; margin: 0; padding: 0; overflow-y: auto; flex: 1; }
        .notification-item { padding: var(--space-3) var(--space-4); border-bottom: 1px solid var(--color-border); }
        .notification-item:last-child { border-bottom: none; }
        .info { font-size: var(--fs-xs); color: var(--color-text-muted); display: flex; gap: var(--space-2); }
        .details { margin-top: var(--space-1); font-size: var(--fs-sm); color: var(--color-text-primary); }
        .empty { padding: var(--space-4); text-align: center; color: var(--color-text-muted); }
      `}</style>
    </div>
  );
}
