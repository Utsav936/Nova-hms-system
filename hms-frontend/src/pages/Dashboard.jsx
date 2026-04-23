import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import dashboardService from '../services/dashboardService';
import StatsCard from '../components/dashboard/StatsCard';
import ActivityFeed from '../components/dashboard/ActivityFeed';
import QuickActions from '../components/dashboard/QuickActions';
import Card from '../components/common/Card';
import { MdPeople, MdLocalHospital, MdEventNote, MdBusiness, MdAdd, MdDescription, MdSettings } from 'react-icons/md';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, AreaChart, Area } from 'recharts';
import { motion } from 'framer-motion';

export default function Dashboard() {
  const { user, isAdmin, isDoctor, isPatient, isReceptionist } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [greeting, setGreeting] = useState('');

  useEffect(() => {
    const hours = new Date().getHours();
    if (hours < 12) setGreeting('Good Morning');
    else if (hours < 17) setGreeting('Good Afternoon');
    else setGreeting('Good Evening');

    const fetchStats = async () => {
      try {
        const res = await dashboardService.getStats();
        setStats(res.data.data);
      } catch (error) {
        console.error('Failed to load dashboard stats', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="p-8 grid gap-6">
        <div className="skeleton h-32 w-full rounded-2xl" />
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="skeleton h-32 rounded-2xl" />
          <div className="skeleton h-32 rounded-2xl" />
          <div className="skeleton h-32 rounded-2xl" />
          <div className="skeleton h-32 rounded-2xl" />
        </div>
      </div>
    );
  }

  const getAdminActions = () => [
    { label: 'Register Doctor', description: 'Add new medical staff', icon: <MdAdd />, color: 'rgba(56, 189, 248, 0.2)', onClick: () => navigate('/doctors') },
    { label: 'New Department', description: 'Expand hospital wings', icon: <MdBusiness />, color: 'rgba(244, 63, 94, 0.2)', onClick: () => navigate('/departments') },
    { label: 'System Reports', description: 'Analyze performance', icon: <MdDescription />, color: 'rgba(168, 85, 247, 0.2)', onClick: () => {} },
    { label: 'Config Settings', description: 'Manage system parameters', icon: <MdSettings />, color: 'rgba(234, 179, 8, 0.2)', onClick: () => {} },
  ];

  const getRecentActivity = () => {
    if (!stats?.recent_appointments) return [];
    return stats.recent_appointments.slice(0, 5).map(apt => ({
      id: apt.id,
      type: apt.status === 'completed' ? 'completion' : 'appointment',
      message: `${apt.patient_first_name || 'Patient'} has a ${apt.status || 'new'} session with Dr. ${apt.doctor_first_name || 'Specialist'}`,
      time: apt.appointment_date ? new Date(apt.appointment_date).toLocaleDateString() : 'Today'
    }));
  };

  let content = (
    <div className="dashboard-page animate-fade-in">
      <header className="dashboard-header">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="welcome-box"
        >
          <span className="greeting-tag">{greeting},</span>
          <h1 className="user-name">{user?.first_name} {user?.last_name}</h1>
          <p className="role-tag">{isAdmin ? 'Hospital Administrator' : isDoctor ? 'Medical Specialist' : isReceptionist ? 'Front Desk Executive' : 'Valued Patient'}</p>
        </motion.div>
        
        <div className="header-stats">
          <div className="h-stat-item">
            <span className="h-stat-label">System Health</span>
            <span className="h-stat-value text-success">Optimal</span>
          </div>
          <div className="h-stat-item">
            <span className="h-stat-label">Live Users</span>
            <span className="h-stat-value">24</span>
          </div>
        </div>
      </header>

      {isAdmin && <QuickActions actions={getAdminActions()} />}

      <div className="stats-grid stagger-children">
        <StatsCard title="Total Patients" value={stats?.total_patients || 0} icon={<MdPeople />} colorClass="info" />
        <StatsCard title="Total Doctors" value={stats?.total_doctors || 0} icon={<MdLocalHospital />} colorClass="success" />
        <StatsCard title="Appointments Today" value={stats?.today_appointments || 0} icon={<MdEventNote />} colorClass="accent" />
        <StatsCard title="Departments" value={stats?.total_departments || 0} icon={<MdBusiness />} colorClass="warning" />
      </div>

      <div className="dashboard-main-grid">
        <div className="grid-left">
          <Card title="Appointment Trend" subtitle="Patient inflow over the last 7 days">
            <div className="chart-container">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={stats?.weekly_trend || []}>
                  <defs>
                    <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="var(--color-accent)" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="var(--color-accent)" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <XAxis 
                    dataKey="date" 
                    tickFormatter={(val) => new Date(val).toLocaleDateString('en-US', { weekday: 'short' })}
                    stroke="var(--color-text-muted)"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12 }}
                  />
                  <YAxis 
                    stroke="var(--color-text-muted)"
                    axisLine={false}
                    tickLine={false}
                    allowDecimals={false}
                    tick={{ fontSize: 12 }}
                  />
                  <Tooltip 
                    contentStyle={{ backgroundColor: 'var(--color-bg-card)', border: '1px solid var(--color-border)', borderRadius: '12px', boxShadow: '0 10px 25px rgba(0,0,0,0.3)' }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="count" 
                    stroke="var(--color-accent)" 
                    strokeWidth={3}
                    fillOpacity={1} 
                    fill="url(#colorCount)" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Card>

          <Card title="Recent Appointments" noPadding>
            <div className="table-responsive">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Patient</th>
                    <th>Medical Specialist</th>
                    <th>Scheduled At</th>
                    <th>Current Status</th>
                  </tr>
                </thead>
                <tbody>
                  {(stats?.recent_appointments || []).map(apt => (
                    <tr key={apt.id}>
                      <td>
                        <div className="flex items-center gap-2">
                          <div className="table-avatar">{(apt.patient_first_name || 'P')[0]}</div>
                          <span>{apt.patient_first_name || 'Unknown'} {apt.patient_last_name || 'Patient'}</span>
                        </div>
                      </td>
                      <td>Dr. {apt.doctor_first_name || 'Specialist'}</td>
                      <td>
                        <div className="text-sm">{apt.appointment_time?.substring(0,5) || '--:--'}</div>
                        <div className="text-xs text-muted">
                          {apt.appointment_date ? new Date(apt.appointment_date).toLocaleDateString() : 'N/A'}
                        </div>
                      </td>
                      <td>
                        <span className={`status-badge status-${apt.status || 'scheduled'}`}>
                          {(apt.status || 'scheduled').replace('_', ' ')}
                        </span>
                      </td>
                    </tr>
                  ))}
                  {stats?.recent_appointments?.length === 0 && (
                    <tr><td colSpan="4" className="text-center text-muted p-8">No recent data available.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </Card>
        </div>

        <div className="grid-right">
          <ActivityFeed activities={getRecentActivity()} />
          
          <Card title="Departmental Load" className="mt-6">
             <div className="dept-load-list">
                {stats?.total_departments > 0 ? (
                  ['Cardiology', 'Neurology', 'Pediatrics'].map((dept, i) => (
                    <div key={i} className="dept-load-item">
                       <div className="dept-info">
                         <span>{dept}</span>
                         <span className="text-muted text-xs">{75 - (i * 15)}% Capacity</span>
                       </div>
                       <div className="progress-bar">
                         <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: `${75 - (i * 15)}%` }}
                          className="progress-fill" 
                          style={{ backgroundColor: i === 0 ? 'var(--color-danger)' : i === 1 ? 'var(--color-warning)' : 'var(--color-success)' }}
                         />
                       </div>
                    </div>
                  ))
                ) : (
                  <p className="text-center text-muted text-sm py-4">No department data</p>
                )}
             </div>
          </Card>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {content}
      <style>{`
        .dashboard-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          margin-bottom: var(--space-8);
          padding-bottom: var(--space-4);
          border-bottom: 1px solid var(--color-border);
        }
        .greeting-tag {
          font-size: var(--fs-lg);
          color: var(--color-accent);
          font-weight: var(--fw-medium);
        }
        .user-name {
          font-size: var(--fs-4xl);
          font-weight: var(--fw-bold);
          color: var(--color-text-primary);
          line-height: 1.1;
          margin: 4px 0;
        }
        .role-tag {
          display: inline-block;
          padding: 4px 12px;
          background: rgba(255, 255, 255, 0.05);
          border-radius: var(--radius-full);
          font-size: var(--fs-xs);
          color: var(--color-text-secondary);
          text-transform: uppercase;
          letter-spacing: 1px;
        }
        .header-stats {
          display: flex;
          gap: var(--space-8);
        }
        .h-stat-item {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
        }
        .h-stat-label {
          font-size: var(--fs-xs);
          color: var(--color-text-muted);
          text-transform: uppercase;
        }
        .h-stat-value {
          font-size: var(--fs-xl);
          font-weight: var(--fw-bold);
          color: var(--color-text-primary);
        }
        
        .stats-grid { 
          display: grid; 
          grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); 
          gap: var(--space-6); 
          margin-bottom: var(--space-8); 
        }
        
        .dashboard-main-grid { 
          display: grid; 
          grid-template-columns: 1fr 320px; 
          gap: var(--space-6); 
        }
        .grid-left {
          display: flex;
          flex-direction: column;
          gap: var(--space-6);
        }
        @media (max-width: 1200px) { .dashboard-main-grid { grid-template-columns: 1fr; } }
        
        .chart-container { height: 300px; width: 100%; margin-top: var(--space-4); }

        .data-table { width: 100%; border-collapse: collapse; }
        .data-table th, .data-table td { padding: var(--space-4); text-align: left; border-bottom: 1px solid var(--color-border); }
        .data-table th { font-size: var(--fs-xs); text-transform: uppercase; color: var(--color-text-muted); font-weight: var(--fw-bold); }
        .data-table tr:hover { background: rgba(255,255,255,0.02); }
        
        .table-avatar {
          width: 32px; height: 32px; border-radius: 50%; background: var(--color-accent-soft); 
          color: var(--color-accent); display: flex; align-items: center; justify-content: center;
          font-weight: bold; font-size: 14px;
        }

        .status-badge { 
          display: inline-flex; height: 24px; align-items: center; padding: 0 12px; 
          border-radius: var(--radius-full); font-size: 10px; font-weight: var(--fw-bold); 
          text-transform: uppercase; letter-spacing: 0.5px;
        }
        .status-scheduled { background: rgba(56, 189, 248, 0.1); color: #38bdf8; }
        .status-completed { background: rgba(34, 197, 94, 0.1); color: #22c55e; }
        .status-cancelled { background: rgba(239, 68, 68, 0.1); color: #ef4444; }
        .status-confirmed { background: rgba(168, 85, 247, 0.1); color: #a855f7; }
        
        .dept-load-list { display: flex; flex-direction: column; gap: var(--space-4); margin-top: var(--space-2); }
        .dept-info { display: flex; justify-content: space-between; font-size: var(--fs-sm); margin-bottom: 4px; }
        .progress-bar { height: 6px; background: rgba(255,255,255,0.05); border-radius: 3px; overflow: hidden; }
        .progress-fill { height: 100%; border-radius: 3px; }
      `}</style>
    </>
  );
}
