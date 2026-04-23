import { useState, useEffect } from 'react';
import doctorService from '../../services/doctorService';
import departmentService from '../../services/departmentService';
import { useToast } from '../../contexts/ToastContext';
import Modal from '../common/Modal';
import Button from '../common/Button';

export default function AddDoctorModal({ isOpen, onClose, onSuccess }) {
  const { error, success } = useToast();
  
  const [departments, setDepartments] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    password: '',
    phone: '',
    department_id: '',
    specialization: '',
    experience_years: '',
    consultation_fee: '',
    bio: '',
  });

  useEffect(() => {
    if (isOpen) {
      fetchDepartments();
      setFormData({
        first_name: '', last_name: '', email: '', password: '', phone: '',
        department_id: '', specialization: '', experience_years: '', consultation_fee: '', bio: '',
      });
    }
  }, [isOpen]);

  const fetchDepartments = async () => {
    setIsLoading(true);
    try {
      const res = await departmentService.getAll();
      setDepartments(res.data.data);
    } catch (err) {
      error('Failed to load departments.');
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
    setIsSubmitting(true);
    
    try {
      // Convert numeric fields from strings to numbers before sending
      const payload = {
        ...formData,
        experience_years: formData.experience_years ? parseInt(formData.experience_years, 10) : undefined,
        consultation_fee: formData.consultation_fee ? parseFloat(formData.consultation_fee) : undefined,
      };

      await doctorService.create(payload);
      success('Doctor created successfully!');
      onSuccess();
      onClose();
    } catch (err) {
      error(err.response?.data?.message || 'Failed to create doctor.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add New Doctor">
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
            <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} required className="custom-input" />
          </div>
          <div className="form-group flex-col gap-1">
            <label htmlFor="phone">Phone</label>
            <input type="text" id="phone" name="phone" value={formData.phone} onChange={handleChange} required className="custom-input" />
          </div>
        </div>

        <div className="form-group flex-col gap-1">
          <label htmlFor="password">Temporary Password</label>
          <input type="password" id="password" name="password" minLength="8" value={formData.password} onChange={handleChange} required className="custom-input" />
        </div>

        <div className="form-row">
          <div className="form-group flex-col gap-1">
            <label htmlFor="department_id">Department</label>
            <select id="department_id" name="department_id" value={formData.department_id} onChange={handleChange} required className="custom-input" disabled={isLoading}>
              <option value="" disabled>Select Department</option>
              {departments.map(dep => (
                <option key={dep.id} value={dep.id}>{dep.name}</option>
              ))}
            </select>
          </div>
          <div className="form-group flex-col gap-1">
            <label htmlFor="specialization">Specialization</label>
            <input type="text" id="specialization" name="specialization" value={formData.specialization} onChange={handleChange} required className="custom-input" />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group flex-col gap-1">
            <label htmlFor="experience_years">Experience (Years)</label>
            <input type="number" id="experience_years" name="experience_years" min="0" value={formData.experience_years} onChange={handleChange} required className="custom-input" />
          </div>
          <div className="form-group flex-col gap-1">
            <label htmlFor="consultation_fee">Consultation Fee ($)</label>
            <input type="number" id="consultation_fee" name="consultation_fee" min="0" step="0.01" value={formData.consultation_fee} onChange={handleChange} required className="custom-input" />
          </div>
        </div>

        <div className="form-group flex-col gap-1">
          <label htmlFor="bio">Professional Bio</label>
          <textarea id="bio" name="bio" value={formData.bio} onChange={handleChange} rows="3" className="custom-input" maxLength={1000}></textarea>
        </div>

        <div className="form-actions mt-4">
          <Button type="button" variant="secondary" onClick={onClose} style={{ flex: 1 }}>Cancel</Button>
          <Button type="submit" isLoading={isSubmitting} style={{ flex: 1 }}>Create Account</Button>
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
