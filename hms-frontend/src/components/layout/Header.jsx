import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../contexts/ToastContext';
import { useNavigate } from 'react-router-dom';
import { MdLogout, MdNotifications, MdSearch } from 'react-icons/md';
import NotificationBar from '../common/NotificationBar';
import { useEffect, useState } from 'react';
import appointmentService from '../../services/appointmentService';

export default function Header() {
  const { logout } = useAuth();
  const { success } = useToast();
  const navigate = useNavigate();
  const [notifCount, setNotifCount] = useState(0);
  const [showNotif, setShowNotif] = useState(false);
  const [notifications, setNotifications] = useState([]);

  const handleLogout = async () => {
    await logout();
    success('Logged out successfully');
    navigate('/login');
  };

  // Fetch count and list of scheduled appointments for notification badge
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const res = await appointmentService.getAll({ status: 'scheduled' });
        const data = res.data.data;
        setNotifCount(data.length);
        setNotifications(data.slice(0, 5)); // keep latest 5
      } catch (err) {
        // ignore errors silently
      }
    };
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 30000); // refresh every 30s
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="header">
      <div className="header-search">
        <MdSearch className="search-icon" size={20} />
        <input type="text" placeholder="Search patients, doctors..." className="search-input" />
      </div>

      <div className="header-actions">
        <button className="icon-btn" aria-label="Notifications" onClick={() => setShowNotif(!showNotif)}>
          <MdNotifications size={22} />
          {notifCount > 0 && <span className="badge">{notifCount}</span>}
        </button>
        <button onClick={handleLogout} className="icon-btn btn-logout" aria-label="Logout">
          <MdLogout size={22} />
        </button>
        {showNotif && <NotificationBar notifications={notifications} onClose={() => setShowNotif(false)} />}
      </div>

      <style>{`
        .header {
          height: var(--header-height);
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 var(--space-8);
          background: rgba(6, 8, 15, 0.8);
          backdrop-filter: blur(12px);
          border-bottom: 1px solid var(--color-border);
          position: sticky;
          top: 0;
          z-index: 50;
        }

        .header-search {
          display: flex;
          align-items: center;
          background: var(--color-bg-input);
          border-radius: var(--radius-full);
          padding: var(--space-2) var(--space-4);
          width: 300px;
          border: 1px solid var(--color-border);
          transition: border-color var(--transition-fast), box-shadow var(--transition-fast);
        }

        .header-search:focus-within {
          border-color: var(--color-accent);
          box-shadow: 0 0 0 3px var(--color-accent-soft);
        }

        .search-icon {
          color: var(--color-text-muted);
          margin-right: var(--space-2);
        }

        .search-input {
          flex: 1;
          background: transparent;
          border: none;
          color: var(--color-text-primary);
          font-size: var(--fs-sm);
        }

        .search-input::placeholder {
          color: var(--color-text-muted);
        }

        .header-actions {
          display: flex;
          align-items: center;
          gap: var(--space-4);
        }

        .icon-btn {
          width: 40px;
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: var(--radius-full);
          color: var(--color-text-secondary);
          background: transparent;
          transition: all var(--transition-fast);
          position: relative;
        }

        .icon-btn:hover {
          background: var(--color-bg-card-hover);
          color: var(--color-text-primary);
        }

        .btn-logout:hover {
          color: var(--color-danger);
          background: var(--color-danger-soft);
        }

        .badge {
          position: absolute;
          top: 8px;
          right: 10px;
          width: 8px;
          height: 8px;
          background: var(--color-danger);
          border-radius: var(--radius-full);
          box-shadow: 0 0 0 2px var(--color-bg-primary);
        }
      `}</style>
    </header>
  );
}
