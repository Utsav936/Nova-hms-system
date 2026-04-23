import { useState, useEffect } from 'react';
import doctorService from '../../services/doctorService';
import appointmentService from '../../services/appointmentService';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../contexts/ToastContext';
import Modal from '../common/Modal';
import Button from '../common/Button';

export default function BookAppointmentModal({ isOpen, onClose, onSuccess }) {
  const { user } = useAuth();
  const { error, success } = useToast();
  
  const [doctors, setDoctors] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    doctor_id: '',
    appointment_date: '',
    appointment_time: '',
    type: 'consultation',
    reason: '',
  });

  useEffect(() => {
    if (isOpen) {
      fetchDoctors();
      // Reset form
      setFormData({
        doctor_id: '',
        appointment_date: '',
        appointment_time: '',
        type: 'consultation',
        reason: '',
      });
    }
  }, [isOpen]);

  const fetchDoctors = async () => {
    setIsLoading(true);
    try {
      const res = await doctorService.getAll();
      setDoctors(res.data.data);
    } catch (err) {
      error('Failed to load available doctors.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user?.patient_profile?.id) {
      error('User profile not found. Cannot book appointment.');
      return;
    }

    setIsSubmitting(true);
    try {
      await appointmentService.create({
        ...formData,
        patient_id: user.patient_profile.id,
      });
      success('Appointment booked successfully!');
      onSuccess();
      onClose();
    } catch (err) {
      error(err.response?.data?.message || 'Failed to book appointment. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Prevent past dates
  const today = new Date().toISOString().split('T')[0];

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Book Appointment">
      <form onSubmit={handleSubmit} className="book-appointment-form flex-col gap-4">
        
        <div className="form-group flex-col gap-1">
          <label htmlFor="doctor_id">Select Doctor</label>
          <select 
            id="doctor_id" 
            name="doctor_id" 
            value={formData.doctor_id} 
            onChange={handleChange} 
            required 
            className="custom-input"
            disabled={isLoading}
          >
            <option value="" disabled>Choose a specialist...</option>
            {doctors.map(doc => (
              <option key={doc.id} value={doc.id}>
                Dr. {doc.first_name} {doc.last_name} — {doc.department_name || doc.specialization}
              </option>
            ))}
          </select>
        </div>

        <div className="form-row">
          <div className="form-group flex-col gap-1">
            <label htmlFor="appointment_date">Date</label>
            <input 
              type="date" 
              id="appointment_date" 
              name="appointment_date" 
              value={formData.appointment_date} 
              onChange={handleChange} 
              min={today}
              required 
              className="custom-input"
            />
          </div>

          <div className="form-group flex-col gap-1">
            <label htmlFor="appointment_time">Time</label>
            <input 
              type="time" 
              id="appointment_time" 
              name="appointment_time" 
              value={formData.appointment_time} 
              onChange={handleChange} 
              required 
              className="custom-input"
            />
          </div>
        </div>

        <div className="form-group flex-col gap-1">
          <label htmlFor="type">Consultation Type</label>
          <select 
            id="type" 
            name="type" 
            value={formData.type} 
            onChange={handleChange} 
            required 
            className="custom-input"
          >
            <option value="consultation">Consultation</option>
            <option value="follow_up">Follow Up</option>
            <option value="routine_checkup">Routine Checkup</option>
          </select>
        </div>

        <div className="form-group flex-col gap-1">
          <label htmlFor="reason">Reason for Visit</label>
          <textarea 
            id="reason" 
            name="reason" 
            value={formData.reason} 
            onChange={handleChange} 
            rows="3"
            placeholder="Briefly describe your symptoms or reason for visit..."
            className="custom-input"
            maxLength={500}
          ></textarea>
        </div>

        <div className="form-actions mt-4">
          <Button type="button" variant="secondary" onClick={onClose} style={{ flex: 1 }}>Cancel</Button>
          <Button type="submit" isLoading={isSubmitting} style={{ flex: 1 }}>Confirm Booking</Button>
        </div>
      </form>

      <style>{`
        .book-appointment-form {
          display: flex;
        }

        .form-row {
          display: flex;
          gap: var(--space-4);
        }
        .form-row > .form-group {
          flex: 1;
        }

        .form-group label {
          font-size: var(--fs-sm);
          color: var(--color-text-secondary);
          font-weight: var(--fw-medium);
        }

        .custom-input {
          width: 100%;
          background-color: var(--color-bg-input);
          border: 1px solid var(--color-border);
          color: var(--color-text-primary);
          border-radius: var(--radius-sm);
          padding: var(--space-3) var(--space-4);
          transition: border-color var(--transition-fast), box-shadow var(--transition-fast);
        }

        .custom-input:focus {
          border-color: var(--color-accent);
          box-shadow: 0 0 0 2px var(--color-accent-soft);
        }

        .custom-input:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }
        
        select.custom-input {
          appearance: none;
          background-image: url("data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2214%22%20height%3D%2214%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%2394a3b8%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpolyline%20points%3D%226%209%2012%2015%2018%209%22%3E%3C%2Fpolyline%3E%3C%2Fsvg%3E");
          background-repeat: no-repeat;
          background-position: right var(--space-4) center;
          padding-right: var(--space-10);
        }

        .form-actions {
          display: flex;
          gap: var(--space-4);
          margin-top: var(--space-4);
        }
      `}</style>
    </Modal>
  );
}
