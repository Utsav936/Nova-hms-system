import { useState, useEffect } from 'react';
import patientService from '../../services/patientService';
import { useToast } from '../../contexts/ToastContext';
import Modal from '../common/Modal';
import Button from '../common/Button';

export default function AddPatientModal({ isOpen, onClose, onSuccess }) {
  const { error, success } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    date_of_birth: '',
    gender: '',
    blood_group: '',
    address: '',
    emergency_contact_name: '',
    emergency_contact_phone: '',
  });

  useEffect(() => {
    if (isOpen) {
      setFormData({
        first_name: '', last_name: '', email: '', phone: '',
        date_of_birth: '', gender: '', blood_group: '', address: '',
        emergency_contact_name: '', emergency_contact_phone: '',
      });
    }
  }, [isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Clean up empty optional fields
      const payload = { ...formData };
      Object.keys(payload).forEach(key => {
        if (payload[key] === '') {
          delete payload[key];
        }
      });

      await patientService.create(payload);
      success('Patient registered successfully!');
      onSuccess();
      onClose();
    } catch (err) {
      error(err.response?.data?.message || 'Failed to register patient.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Register New Patient">
      <form onSubmit={handleSubmit} className="flex-col gap-4">
        
        <div className="form-row">
          <div className="form-group flex-col gap-1">
            <label htmlFor="first_name">First Name</label>
            <input type="text" id="first_name" name="first_name" value={formData.first_name} onChange={handleChange} required className="custom-input" />
          </div>
          <div className="form-group flex-col gap-1">
            <label htmlFor="last_name">Last Name</label>
            <input type="text" id="last_name" name="last_name" value={formData.last_name} onChange={handleChange} required className="custom-input" />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group flex-col gap-1">
            <label htmlFor="email">Email</label>
            <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} className="custom-input" />
          </div>
          <div className="form-group flex-col gap-1">
            <label htmlFor="phone">Phone</label>
            <input type="text" id="phone" name="phone" value={formData.phone} onChange={handleChange} className="custom-input" />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group flex-col gap-1">
            <label htmlFor="date_of_birth">Date of Birth</label>
            <input type="date" id="date_of_birth" name="date_of_birth" value={formData.date_of_birth} onChange={handleChange} className="custom-input" style={{ colorScheme: 'dark' }} />
          </div>
          <div className="form-group flex-col gap-1">
            <label htmlFor="gender">Gender</label>
            <select id="gender" name="gender" value={formData.gender} onChange={handleChange} className="custom-input">
              <option value="">Select Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>
          <div className="form-group flex-col gap-1">
            <label htmlFor="blood_group">Blood Group</label>
            <select id="blood_group" name="blood_group" value={formData.blood_group} onChange={handleChange} className="custom-input">
              <option value="">Select</option>
              <option value="A+">A+</option>
              <option value="A-">A-</option>
              <option value="B+">B+</option>
              <option value="B-">B-</option>
              <option value="AB+">AB+</option>
              <option value="AB-">AB-</option>
              <option value="O+">O+</option>
              <option value="O-">O-</option>
            </select>
          </div>
        </div>

        <div className="form-group flex-col gap-1">
          <label htmlFor="address">Address</label>
          <input type="text" id="address" name="address" value={formData.address} onChange={handleChange} className="custom-input" />
        </div>

        <div className="form-row mt-2">
          <div className="form-group flex-col gap-1">
            <label htmlFor="emergency_contact_name">Emergency Contact Name</label>
            <input type="text" id="emergency_contact_name" name="emergency_contact_name" value={formData.emergency_contact_name} onChange={handleChange} className="custom-input" />
          </div>
          <div className="form-group flex-col gap-1">
            <label htmlFor="emergency_contact_phone">Emergency Contact Phone</label>
            <input type="text" id="emergency_contact_phone" name="emergency_contact_phone" value={formData.emergency_contact_phone} onChange={handleChange} className="custom-input" />
          </div>
        </div>

        <div className="form-actions mt-4">
          <Button type="button" variant="secondary" onClick={onClose} style={{ flex: 1 }}>Cancel</Button>
          <Button type="submit" isLoading={isSubmitting} style={{ flex: 1 }}>Register Patient</Button>
        </div>
      </form>

      <style>{`
        .form-row { display: flex; gap: var(--space-4); margin-bottom: var(--space-3); }
        .form-row > .form-group { flex: 1; }
        .form-group label { font-size: var(--fs-sm); color: var(--color-text-secondary); font-weight: var(--fw-medium); }
        .custom-input { width: 100%; background: var(--color-bg-input); border: 1px solid var(--color-border); color: var(--color-text-primary); border-radius: var(--radius-sm); padding: var(--space-2) var(--space-3); font-size: var(--fs-sm); transition: all var(--transition-fast); }
        .custom-input:focus { border-color: var(--color-accent); box-shadow: 0 0 0 2px var(--color-accent-soft); outline: none; }
        select.custom-input { appearance: none; background-image: url("data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2214%22%20height%3D%2214%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%2394a3b8%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpolyline%20points%3D%226%209%2012%2015%2018%209%22%3E%3C%2Fpolyline%3E%3C%2Fsvg%3E"); background-repeat: no-repeat; background-position: right var(--space-3) center; padding-right: var(--space-8); }
        .form-actions { display: flex; gap: var(--space-4); }
      `}</style>
    </Modal>
  );
}
