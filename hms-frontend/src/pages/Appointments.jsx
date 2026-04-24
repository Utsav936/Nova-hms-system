import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import appointmentService from '../services/appointmentService';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import CalendarView from '../components/appointments/CalendarView';
import BookAppointmentModal from '../components/appointments/BookAppointmentModal';
import DeclineAppointmentModal from '../components/appointments/DeclineAppointmentModal';
import { MdAdd, MdFilterList, MdCheck, MdClose, MdVisibility, MdCalendarToday, MdFormatListBulleted } from 'react-icons/md';

export default function Appointments() {
  const { user, isPatient, isDoctor, isAdmin, isReceptionist } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [view, setView] = useState(isDoctor ? 'calendar' : 'table');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [declineModalOpen, setDeclineModalOpen] = useState(false);
  const [selectedAppointmentId, setSelectedAppointmentId] = useState(null);
  const { error, success } = useToast();

  const fetchAppointments = async () => {
    setLoading(true);
    try {
      const params = {};
      if (filter !== 'all') params.status = filter;
      
      if (view === 'calendar') {
        const dateStr = selectedDate.toISOString().split('T')[0];
        params.date_from = dateStr;
        params.date_to = dateStr;
      }

      const res = await appointmentService.getAll(params);
      setAppointments(res.data.data);
    } catch (err) {
      error('Failed to fetch appointments.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, [filter, view, selectedDate]);

  const updateStatus = async (id, status) => {
    try {
      await appointmentService.update(id, { status });
      success(`Appointment marked as ${status.replace('_', ' ')}.`);
      fetchAppointments();
    } catch (err) {
      error('Failed to update status.');
    }
  };

  const openDeclineModal = (id) => {
    setSelectedAppointmentId(id);
    setDeclineModalOpen(true);
  };

  const handleCancel = async (id) => {
    if (window.confirm('Are you sure you want to cancel this appointment?')) {
      try {
        await appointmentService.delete(id);
        success('Appointment cancelled.');
        fetchAppointments();
      } catch (err) {
        error(err.response?.data?.message || 'Failed to cancel.');
      }
    }
  };

  return (
    <div className="appointments-page animate-fade-in">
      <div className="page-header flex justify-between items-end mb-6">
        <div>
          <h1 className="text-3xl font-bold text-white mb-1">Master Schedule</h1>
          <p className="text-secondary text-sm">Manage clinical sessions and patient flow</p>
        </div>
        
        <div className="flex gap-4 items-center">
          <div className="view-toggle">
            <button className={view === 'calendar' ? 'active' : ''} onClick={() => setView('calendar')}><MdCalendarToday /> Calendar</button>
            <button className={view === 'table' ? 'active' : ''} onClick={() => setView('table')}><MdFormatListBulleted /> Table</button>
          </div>

          {(isPatient || isAdmin || isReceptionist) && (
            <Button icon={<MdAdd />} onClick={() => setIsModalOpen(true)}>
              Book Appointment
            </Button>
          )}
        </div>
      </div>

      {view === 'calendar' ? (
        <CalendarView 
          appointments={appointments} 
          selectedDate={selectedDate} 
          onSelectDate={setSelectedDate} 
        />
      ) : (
        <Card>
          <div className="flex justify-between items-center mb-4">
            <div className="flex gap-2">
              <div className="filter-wrapper">
                <MdFilterList className="text-muted" />
                <select value={filter} onChange={(e) => setFilter(e.target.value)}>
                  <option value="all">All Status</option>
                  <option value="scheduled">Scheduled</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
            </div>
          </div>

          {loading && <div className="p-8 text-center text-secondary">Loading appointments...</div>}
          
          {!loading && appointments.length === 0 && (
            <div className="p-8 text-center text-muted">
              <p>No appointments found for this selection.</p>
            </div>
          )}

          {!loading && appointments.length > 0 && (
            <div className="table-responsive">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Date & Time</th>
                    <th>{isPatient ? 'Doctor' : 'Patient'}</th>
                    <th>Type</th>
                    <th>Status</th>
                    <th className="text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {appointments.map(apt => (
                    <tr key={apt.id}>
                      <td>
                        <div className="font-semibold text-white">
                          {apt.appointment_date ? new Date(apt.appointment_date + 'T00:00:00').toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric'}) : '—'}
                        </div>
                        <div className="text-xs text-muted">{apt.appointment_time ? apt.appointment_time.substring(0,5) : ''}</div>
                      </td>
                      <td>
                        {isPatient ? (
                          <>
                            <div className="text-sm font-medium">Dr. {apt.doctor_name || apt.doctor_last_name || '—'}</div>
                            <div className="text-xs text-muted">{apt.specialization}</div>
                          </>
                        ) : (
                          <>
                            <div className="text-sm font-medium">{apt.patient_name || `${apt.patient_first_name || ''} ${apt.patient_last_name || ''}`.trim() || '—'}</div>
                          </>
                        )}
                      </td>
                      <td><span className="capitalize text-sm">{apt.type.replace('_', ' ')}</span></td>
                      <td>
                        <span className={`status-badge status-${apt.status}`}>
                          {apt.status.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="text-right">
                        <div className="flex justify-end gap-2">
                          <button className="icon-btn-sm" title="View"><MdVisibility /></button>
                          {(!isPatient && apt.status === 'scheduled') && (
                            <>
                              <button className="icon-btn-sm text-success" title="Confirm" onClick={() => updateStatus(apt.id, 'confirmed')}><MdCheck /></button>
                              <button className="icon-btn-sm text-danger" title="Decline" onClick={() => openDeclineModal(apt.id)}><MdClose /></button>
                            </>
                          )}
                          {(!isPatient && apt.status === 'confirmed') && (
                            <button className="icon-btn-sm text-info" title="Complete" onClick={() => updateStatus(apt.id, 'completed')}><MdCheck /></button>
                          )}
                          {(isPatient && (apt.status === 'scheduled' || apt.status === 'confirmed')) && (
                            <button className="icon-btn-sm text-danger" title="Cancel" onClick={() => handleCancel(apt.id)}><MdClose /></button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>
      )}

      <style>{`
        .view-toggle {
          display: flex; background: var(--color-bg-input); border-radius: var(--radius-full); padding: 4px; border: 1px solid var(--color-border);
        }
        .view-toggle button {
          border: none; background: transparent; color: var(--color-text-muted); padding: 6px 16px; border-radius: var(--radius-full);
          font-size: 13px; font-weight: bold; cursor: pointer; display: flex; align-items: center; gap: 6px; transition: all 0.2s;
        }
        .view-toggle button.active { background: var(--color-accent); color: white; }
        
        .filter-wrapper {
          display: flex; align-items: center; gap: var(--space-2); background: var(--color-bg-input);
          border: 1px solid var(--color-border); padding: 0 var(--space-3); border-radius: var(--radius-md); height: 36px;
        }
        .filter-wrapper select { background: transparent; border: none; color: var(--color-text-primary); cursor: pointer; outline: none; }
        
        .data-table { width: 100%; border-collapse: collapse; }
        .data-table th, .data-table td { padding: var(--space-3) var(--space-4); text-align: left; border-bottom: 1px solid var(--color-border); vertical-align: middle; }
        .data-table th { font-size: var(--fs-xs); text-transform: uppercase; color: var(--color-text-muted); font-weight: var(--fw-semibold); }
        .data-table tr:hover { background: rgba(255,255,255,0.02); }
        
        .status-badge { display: inline-flex; height: 24px; align-items: center; padding: 0 10px; border-radius: var(--radius-full); font-size: 11px; font-weight: var(--fw-semibold); text-transform: uppercase; }
        .status-scheduled { background: rgba(56, 189, 248, 0.1); color: #38bdf8; }
        .status-completed { background: rgba(34, 197, 94, 0.1); color: #22c55e; }
        .status-cancelled, .status-no_show { background: rgba(239, 68, 68, 0.1); color: #ef4444; }
        .status-in_progress { background: rgba(245, 158, 11, 0.1); color: #f59e0b; }
        .status-confirmed { background: rgba(168, 85, 247, 0.1); color: #a855f7; }
        
        .icon-btn-sm {
          display: inline-flex; align-items: center; justify-content: center; width: 28px; height: 28px;
          border-radius: var(--radius-md); background: transparent; border: 1px solid transparent; color: var(--color-text-muted); transition: all 0.2s;
        }
        .icon-btn-sm:hover { background: var(--color-bg-input); color: var(--color-text-primary); border-color: var(--color-border); }
        .icon-btn-sm.text-success:hover { color: var(--color-success); background: var(--color-success-soft); }
        .icon-btn-sm.text-danger:hover { color: var(--color-danger); background: var(--color-danger-soft); }
      `}</style>
      
      <BookAppointmentModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSuccess={fetchAppointments} 
      />

      <DeclineAppointmentModal
        isOpen={declineModalOpen}
        onClose={() => { setDeclineModalOpen(false); setSelectedAppointmentId(null); }}
        appointmentId={selectedAppointmentId}
        onSuccess={fetchAppointments}
      />
    </div>
  );
}
