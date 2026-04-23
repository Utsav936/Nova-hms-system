import { useState } from 'react';
import Modal from '../common/Modal';
import Button from '../common/Button';
import { useToast } from '../../contexts/ToastContext';
import appointmentService from '../../services/appointmentService';

export default function DeclineAppointmentModal({ isOpen, onClose, appointmentId, onSuccess }) {
  const [reason, setReason] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { error, success } = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!reason.trim()) {
      error('Please provide a reason for declining.');
      return;
    }
    
    setIsLoading(true);
    try {
      await appointmentService.update(appointmentId, { 
        status: 'cancelled',
        notes: reason 
      });
      success('Appointment declined successfully.');
      onSuccess();
      onClose();
    } catch (err) {
      error('Failed to decline appointment.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Decline Appointment">
      <form onSubmit={handleSubmit} className="flex-col gap-4">
        <div className="form-group flex-col gap-1">
          <label htmlFor="reason" style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--fs-sm)'}}>Reason for Decline</label>
          <textarea
            id="reason"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            rows="4"
            placeholder="Doctor is unavailable, double booking, etc..."
            required
            style={{
              width: '100%',
              padding: 'var(--space-3)',
              borderRadius: 'var(--radius-sm)',
              border: '1px solid var(--color-border)',
              background: 'var(--color-bg-input)',
              color: 'var(--color-text-primary)'
            }}
          />
        </div>
        <div className="flex gap-4 mt-4">
          <Button type="button" variant="secondary" onClick={onClose} style={{ flex: 1 }}>Cancel</Button>
          <Button type="submit" isLoading={isLoading} style={{ flex: 1, background: 'var(--color-danger)', borderColor: 'var(--color-danger)' }}>Confirm Decline</Button>
        </div>
      </form>
    </Modal>
  );
}
