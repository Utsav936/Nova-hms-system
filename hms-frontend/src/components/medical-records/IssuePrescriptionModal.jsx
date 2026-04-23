import { useState, useEffect } from 'react';
import Modal from '../common/Modal';
import Input from '../common/Input';
import Button from '../common/Button';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../contexts/ToastContext';
import prescriptionService from '../../services/prescriptionService';
import patientService from '../../services/patientService';

export default function IssuePrescriptionModal({ isOpen, onClose, onSuccess }) {
  const { user } = useAuth();
  const { success, error } = useToast();
  const [loading, setLoading] = useState(false);
  const [patients, setPatients] = useState([]);
  const [formData, setFormData] = useState({
    patient_id: '',
    medication_name: '',
    dosage: '',
    frequency: '',
    duration: '',
    instructions: ''
  });

  useEffect(() => {
    if (isOpen) {
      const fetchPatients = async () => {
        try {
          const res = await patientService.getAll({ limit: 100 });
          setPatients(res.data.data.patients);
        } catch (err) {
          console.error('Failed to fetch patients');
        }
      };
      fetchPatients();
    }
  }, [isOpen]);

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await prescriptionService.create(formData);
      success('Prescription issued successfully!');
      onSuccess();
      onClose();
      setFormData({
        patient_id: '',
        medication_name: '',
        dosage: '',
        frequency: '',
        duration: '',
        instructions: ''
      });
    } catch (err) {
      error(err.response?.data?.message || 'Failed to issue prescription.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Issue Digital Prescription">
      <form onSubmit={handleSubmit} className="stagger-children">
        <div className="input-group mb-4">
          <label className="input-label">Select Patient</label>
          <select 
            name="patient_id" 
            value={formData.patient_id} 
            onChange={handleChange}
            className="input-field"
            required
          >
            <option value="">Choose a patient...</option>
            {patients.map(p => (
              <option key={p.id} value={p.id}>{p.first_name} {p.last_name}</option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Input 
            label="Medication Name" 
            name="medication_name" 
            value={formData.medication_name} 
            onChange={handleChange} 
            required
            placeholder="e.g. Amoxicillin"
          />
          <Input 
            label="Dosage" 
            name="dosage" 
            value={formData.dosage} 
            onChange={handleChange} 
            required
            placeholder="e.g. 500mg"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Input 
            label="Frequency" 
            name="frequency" 
            value={formData.frequency} 
            onChange={handleChange} 
            required
            placeholder="e.g. Twice a day"
          />
          <Input 
            label="Duration" 
            name="duration" 
            value={formData.duration} 
            onChange={handleChange} 
            required
            placeholder="e.g. 7 days"
          />
        </div>

        <div className="input-group mb-6">
          <label className="input-label">Special Instructions</label>
          <textarea 
            name="instructions" 
            value={formData.instructions} 
            onChange={handleChange}
            className="input-field"
            rows="3"
            placeholder="e.g. Take after meals"
          ></textarea>
        </div>

        <div className="flex justify-end gap-3">
          <Button variant="outline" onClick={onClose} type="button">Cancel</Button>
          <Button type="submit" loading={loading}>Issue Prescription</Button>
        </div>
      </form>

      <style jsx>{`
        .grid { display: grid; }
        .grid-cols-2 { grid-template-columns: 1fr 1fr; }
        .gap-4 { gap: 1rem; }
        .mb-4 { margin-bottom: 1rem; }
        .mb-6 { margin-bottom: 1.5rem; }
      `}</style>
    </Modal>
  );
}
