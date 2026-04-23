import { NavLink, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import ThemeToggle from '../common/ThemeToggle';
import { 
  MdDashboard, 
  MdPeople, 
  MdLocalHospital, 
  MdEventNote, 
  MdFolderShared,
  MdAssignmentInd,
  MdScience,
  MdMedication
} from 'react-icons/md';

export default function Sidebar() {
  const { user, isAdmin, isDoctor, isReceptionist, isPatient } = useAuth();

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: <MdDashboard size={20} />, active: true },
    { 
      name: 'Patients', 
      path: '/patients', 
      icon: <MdPeople size={20} />, 
      show: isAdmin || isDoctor || isReceptionist 
    },
    { 
      name: 'Doctors', 
      path: '/doctors', 
      icon: <MdLocalHospital size={20} />, 
      show: isAdmin 
    },
    { 
      name: 'Staff', 
      path: '/staff', 
      icon: <MdAssignmentInd size={20} />, 
      show: isAdmin 
    },
    { 
      name: 'Appointments', 
      path: '/appointments', 
      icon: <MdEventNote size={20} />, 
      show: true 
    },
    { 
      name: 'Records', 
      path: '/medical-records', 
      icon: <MdFolderShared size={20} />, 
      show: isAdmin || isDoctor || isPatient
    },
    { 
      name: 'Prescriptions', 
      path: '/prescriptions', 
      icon: <MdMedication size={20} />, 
      show: true 
    },
    { 
      name: 'Lab Results', 
      path: '/lab-results', 
      icon: <MdScience size={20} />, 
      show: true 
    },
  ];

  return (
    <aside className="sidebar">
      <div className="sidebar-header" style={{ justifyContent: 'space-between', width: '100%' }}>
        <Link to="/dashboard" className="sidebar-brand flex items-center gap-2">
          <MdLocalHospital size={24} className="text-accent" />
          <span>Nova</span><span style={{color: 'var(--color-text-primary)'}}>HMS</span>
        </Link>
        <ThemeToggle />
      </div>

      <div className="sidebar-user">
        <div className="user-avatar">
          {user?.first_name?.charAt(0) || 'U'}
        </div>
        <div className="user-info">
          <div className="user-name">{user?.first_name} {user?.last_name}</div>
          <div className="user-role">{user?.role}</div>
        </div>
      </div>

      <nav className="sidebar-nav">
        <ul className="nav-list stagger-children">
          {navItems.filter(item => item.show !== false).map((item) => (
            <li key={item.path} className="nav-item">
              <NavLink 
                to={item.path} 
                className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                end={item.path === '/dashboard'}
              >
                <span className="nav-icon">{item.icon}</span>
                <span className="nav-text">{item.name}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      <style>{`
        .sidebar {
          width: var(--sidebar-width);
          background-color: var(--color-bg-sidebar);
          border-right: 1px solid var(--color-border);
          display: flex;
          flex-direction: column;
          transition: width var(--transition-base);
          z-index: 100;
        }

        .sidebar-header {
          height: var(--header-height);
          display: flex;
          align-items: center;
          padding: 0 var(--space-6);
          border-bottom: 1px solid var(--color-border);
        }

        .sidebar-brand {
          font-size: var(--fs-xl);
          font-weight: var(--fw-bold);
          color: var(--color-text-primary);
          text-decoration: none;
        }

        .sidebar-brand span {
          color: var(--color-accent);
        }

        .sidebar-user {
          display: flex;
          align-items: center;
          gap: var(--space-3);
          padding: var(--space-5) var(--space-6);
          border-bottom: 1px solid rgba(255,255,255,0.03);
          margin-bottom: var(--space-4);
        }

        .user-avatar {
          width: 40px;
          height: 40px;
          border-radius: var(--radius-full);
          background: linear-gradient(135deg, var(--color-accent), #4f46e5);
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: var(--fw-bold);
          font-size: var(--fs-lg);
          text-transform: uppercase;
        }

        .user-info {
          display: flex;
          flex-direction: column;
          overflow: hidden;
        }

        .user-name {
          font-weight: var(--fw-semibold);
          color: var(--color-text-primary);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .user-role {
          font-size: var(--fs-xs);
          color: var(--color-text-muted);
          text-transform: capitalize;
        }

        .sidebar-nav {
          flex: 1;
          padding: 0 var(--space-4);
          overflow-y: auto;
        }

        .nav-list {
          display: flex;
          flex-direction: column;
          gap: var(--space-1);
        }

        .nav-link {
          display: flex;
          align-items: center;
          gap: var(--space-3);
          padding: var(--space-3) var(--space-4);
          border-radius: var(--radius-md);
          color: var(--color-text-secondary);
          transition: all var(--transition-fast);
          text-decoration: none;
          position: relative;
          overflow: hidden;
        }

        .nav-link:hover {
          color: var(--color-text-primary);
          background: rgba(255,255,255,0.03);
        }

        .nav-link.active {
          color: var(--color-accent);
          background: var(--color-accent-soft);
          font-weight: var(--fw-medium);
        }

        .nav-link.active::before {
          content: '';
          position: absolute;
          left: 0;
          top: 10%;
          bottom: 10%;
          width: 3px;
          background: var(--color-accent);
          border-radius: 0 var(--radius-sm) var(--radius-sm) 0;
        }

        .nav-icon {
          display: flex;
          transition: transform var(--transition-fast);
        }

        .nav-link:hover .nav-icon {
          transform: scale(1.1);
        }
      `}</style>
    </aside>
  );
}
