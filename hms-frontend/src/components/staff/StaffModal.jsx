import { useState, useEffect } from 'react';
import Modal from '../common/Modal';
import Input from '../common/Input';
import Button from '../common/Button';

export default function StaffModal({ isOpen, onClose, onSave, loading, initialData }) {
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    contact_number: '',
    role_title: '',
    department_id: '',
    shift_timing: '',
    description: ''
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initialData) {
      setFormData({
        first_name: initialData.first_name || '',
        last_name: initialData.last_name || '',
        email: initialData.email || '',
        contact_number: initialData.contact_number || '',
        role_title: initialData.role_title || '',
        department_id: initialData.department_id || '',
        shift_timing: initialData.shift_timing || '',
        description: initialData.description || ''
      });
    } else {
      setFormData({
        first_name: '',
        last_name: '',
        email: '',
        contact_number: '',
        role_title: '',
        department_id: '',
        shift_timing: '',
        description: ''
      });
    }
    setErrors({});
  }, [initialData, isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.first_name.trim()) newErrors.first_name = 'First name is required';
    if (!formData.last_name.trim()) newErrors.last_name = 'Last name is required';
    if (!formData.role_title.trim()) newErrors.role_title = 'Role is required';
    
    if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Invalid email address';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      onSave(formData);
    }
  };

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose} 
      title={initialData ? 'Edit Staff Member' : 'Add New Staff Member'}
    >
      <form onSubmit={handleSubmit} className="staff-form stagger-children">
        <div className="form-grid">
          <Input 
            label="First Name *" 
            name="first_name" 
            value={formData.first_name} 
            onChange={handleChange} 
            error={errors.first_name}
            placeholder="John"
          />
          <Input 
            label="Last Name *" 
            name="last_name" 
            value={formData.last_name} 
            onChange={handleChange} 
            error={errors.last_name}
            placeholder="Doe"
          />
        </div>

        <div className="form-grid">
          <Input 
            label="Role / Title *" 
            name="role_title" 
            value={formData.role_title} 
            onChange={handleChange} 
            error={errors.role_title}
            placeholder="e.g. Registered Nurse"
          />
          <div className="input-group">
            <label className="input-label">Department</label>
            <div className="select-wrapper">
              <select 
                className="input-field"
                name="department_id" 
                value={formData.department_id} 
                onChange={handleChange}
              >
                <option value="">General / None</option>
                <option value="1">Cardiology</option>
                <option value="2">Neurology</option>
                <option value="3">Pediatrics</option>
              </select>
            </div>
          </div>
        </div>

        <div className="form-grid">
          <Input 
            label="Email" 
            type="email"
            name="email" 
            value={formData.email} 
            onChange={handleChange} 
            error={errors.email}
            placeholder="john.doe@hospital.com"
          />
          <Input 
            label="Contact Number" 
            name="contact_number" 
            value={formData.contact_number} 
            onChange={handleChange} 
            placeholder="+1 234 567 8900"
          />
        </div>

        <Input 
          label="Shift Timing" 
          name="shift_timing" 
          value={formData.shift_timing} 
          onChange={handleChange} 
          placeholder="e.g. Morning (08:00 - 16:00)"
        />

        <div className="input-group">
          <label className="input-label">Description / Notes</label>
          <textarea 
            className="input-field" 
            name="description" 
            value={formData.description} 
            onChange={handleChange}
            placeholder="Any additional details..."
            rows="3"
            style={{resize: 'vertical', minHeight: '80px'}}
          ></textarea>
        </div>

        <div className="form-actions mt-4 flex justify-end gap-3">
          <Button variant="outline" type="button" onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button type="submit" disabled={loading}>
            {loading ? 'Saving...' : 'Save Staff'}
          </Button>
        </div>
      </form>

      <style>{`
        .form-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: var(--space-4);
        }
        
        @media (max-width: 640px) {
          .form-grid {
            grid-template-columns: 1fr;
            gap: 0;
          }
        }

        .select-wrapper select.input-field {
          appearance: none;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%23a1a1aa' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E");
          background-repeat: no-repeat;
          background-position: right 1rem center;
          padding-right: 2.5rem;
        }

        .select-wrapper select.input-field option {
          background-color: var(--color-bg-card);
          color: var(--color-text-primary);
        }
        
        .staff-form textarea.input-field {
          font-family: inherit;
        }
      `}</style>
    </Modal>
  );
}
