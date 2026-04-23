import { useState, useEffect } from 'react';
import medicalRecordService from '../../services/medicalRecordService';
import patientService from '../../services/patientService';
import { useToast } from '../../contexts/ToastContext';
import Modal from '../common/Modal';
import Button from '../common/Button';
import { MdAdd, MdDelete } from 'react-icons/md';

export default function AddRecordModal({ isOpen, onClose, onSuccess }) {
  const { error, success } = useToast();
  
  const [patients, setPatients] = useState([]);
  const [isLoadingPatients, setIsLoadingPatients] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    patient_id: '',
    diagnosis: '',
    symptoms: '',
    treatment: '',
    notes: '',
  });

  const [prescriptions, setPrescriptions] = useState([]);

  useEffect(() => {
    if (isOpen) {
      fetchPatients();
      setFormData({
        patient_id: '', diagnosis: '', symptoms: '', treatment: '', notes: '',
      });
      setPrescriptions([]);
    }
  }, [isOpen]);

  const fetchPatients = async () => {
    setIsLoadingPatients(true);
    try {
      // Fetch a list of patients for the dropdown. 
      // Note: For a real app with thousands of patients, an autocomplete search is better.
      const res = await patientService.getAll({ limit: 100 }); 
      setPatients(res.data.data);
    } catch (err) {
      error('Failed to load patients list.');
    } finally {
      setIsLoadingPatients(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddPrescription = () => {
    setPrescriptions([...prescriptions, { medication_name: '', dosage: '', frequency: '', duration: '', instructions: '' }]);
  };

  const handleRemovePrescription = (index) => {
    setPrescriptions(prescriptions.filter((_, i) => i !== index));
  };

  const handlePrescriptionChange = (index, field, value) => {
    const updated = [...prescriptions];
    updated[index][field] = value;
    setPrescriptions(updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.patient_id) {
      error('Please select a patient.');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const payload = {
        ...formData,
        // Only include valid prescriptions (with at least medication name)
        prescriptions: prescriptions.filter(p => p.medication_name.trim() !== '')
      };

      await medicalRecordService.create(payload);
      success('Medical record created securely.');
      onSuccess();
      onClose();
    } catch (err) {
      error(err.response?.data?.message || 'Failed to create medical record.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add Patient Medical Record">
      <form onSubmit={handleSubmit} className="flex-col gap-4">
        
        <div className="form-group flex-col gap-1">
          <label htmlFor="patient_id">Select Patient</label>
          <select id="patient_id" name="patient_id" value={formData.patient_id} onChange={handleChange} required className="custom-input" disabled={isLoadingPatients}>
            <option value="" disabled>Search & Select Patient</option>
            {patients.map(p => (
              <option key={p.id} value={p.id}>{p.first_name} {p.last_name} ({p.email || p.phone})</option>
            ))}
          </select>
        </div>

        <div className="form-group flex-col gap-1">
          <label htmlFor="diagnosis">Primary Diagnosis</label>
          <input type="text" id="diagnosis" name="diagnosis" value={formData.diagnosis} onChange={handleChange} required className="custom-input font-semibold" />
        </div>

        <div className="form-row">
          <div className="form-group flex-col gap-1">
            <label htmlFor="symptoms">Symptoms Observed</label>
            <textarea id="symptoms" name="symptoms" value={formData.symptoms} onChange={handleChange} rows="2" className="custom-input"></textarea>
          </div>
          <div className="form-group flex-col gap-1">
            <label htmlFor="treatment">Administered Treatment</label>
            <textarea id="treatment" name="treatment" value={formData.treatment} onChange={handleChange} rows="2" className="custom-input"></textarea>
          </div>
        </div>

        <div className="form-group flex-col gap-1">
          <label htmlFor="notes">Doctor's Private Notes</label>
          <textarea id="notes" name="notes" value={formData.notes} onChange={handleChange} rows="2" className="custom-input"></textarea>
        </div>

        {/* Prescriptions Section */}
        <div className="prescriptions-section mt-2">
          <div className="flex justify-between items-center mb-2">
            <label className="text-white font-medium" style={{fontSize: 'var(--fs-sm)'}}>E-Prescriptions</label>
            <Button type="button" variant="outline" size="sm" icon={<MdAdd />} onClick={handleAddPrescription}>
              Add Medication
            </Button>
          </div>
          
          {prescriptions.length === 0 ? (
            <div className="text-secondary text-sm text-center p-3 border border-dashed rounded-md border-[var(--color-border)]">
              No prescriptions added.
            </div>
          ) : (
            <div className="flex-col gap-3">
              {prescriptions.map((rx, idx) => (
                <div key={idx} className="prescription-card relative p-3 rounded-md bg-[var(--color-bg-secondary)] border border-[var(--color-border)] flex-col gap-2">
                  <button type="button" className="absolute top-2 right-2 text-danger opacity-70 hover:opacity-100" onClick={() => handleRemovePrescription(idx)}>
                    <MdDelete size={18} />
                  </button>
                  
                  <div className="grid grid-cols-2 gap-2">
                    <input type="text" placeholder="Medication Name" className="custom-input-sm" value={rx.medication_name} onChange={(e) => handlePrescriptionChange(idx, 'medication_name', e.target.value)} required />
                    <input type="text" placeholder="Dosage (e.g. 500mg)" className="custom-input-sm" value={rx.dosage} onChange={(e) => handlePrescriptionChange(idx, 'dosage', e.target.value)} required />
                    <input type="text" placeholder="Frequency (e.g. 2x a day)" className="custom-input-sm" value={rx.frequency} onChange={(e) => handlePrescriptionChange(idx, 'frequency', e.target.value)} required />
                    <input type="text" placeholder="Duration (e.g. 7 days)" className="custom-input-sm" value={rx.duration} onChange={(e) => handlePrescriptionChange(idx, 'duration', e.target.value)} />
                  </div>
                  <input type="text" placeholder="Special Instructions (Optional)" className="custom-input-sm w-full mt-1" value={rx.instructions} onChange={(e) => handlePrescriptionChange(idx, 'instructions', e.target.value)} />
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="form-actions mt-4">
          <Button type="button" variant="secondary" onClick={onClose} style={{ flex: 1 }}>Cancel</Button>
          <Button type="submit" isLoading={isSubmitting} style={{ flex: 1 }}>Digitally Sign & Publish Record</Button>
        </div>
      </form>

      <style>{`
        .form-row { display: flex; gap: var(--space-4); margin-bottom: var(--space-3); }
        .form-row > .form-group { flex: 1; }
        .form-group label { font-size: var(--fs-sm); color: var(--color-text-secondary); font-weight: var(--fw-medium); }
        .custom-input { width: 100%; background: var(--color-bg-input); border: 1px solid var(--color-border); color: var(--color-text-primary); border-radius: var(--radius-sm); padding: var(--space-2) var(--space-3); font-size: var(--fs-sm); transition: all var(--transition-fast); }
        .custom-input:focus { border-color: var(--color-accent); box-shadow: 0 0 0 2px var(--color-accent-soft); outline: none; }
        
        .custom-input-sm { width: 100%; background: var(--color-bg-input); border: 1px solid var(--color-border); color: var(--color-text-primary); border-radius: var(--radius-sm); padding: 4px 8px; font-size: var(--fs-xs); transition: all var(--transition-fast); }
        .custom-input-sm:focus { border-color: var(--color-accent); outline: none; }

        select.custom-input { appearance: none; background-image: url("data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2214%22%20height%3D%2214%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%2394a3b8%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpolyline%20points%3D%226%209%2012%2015%2018%209%22%3E%3C%2Fpolyline%3E%3C%2Fsvg%3E"); background-repeat: no-repeat; background-position: right var(--space-3) center; padding-right: var(--space-8); }
        .form-actions { display: flex; gap: var(--space-4); }

        .prescriptions-section { background: rgba(0,0,0,0.1); padding: var(--space-3); border-radius: var(--radius-md); }
        
        .grid { display: grid; }
        .grid-cols-2 { grid-template-columns: repeat(2, minmax(0, 1fr)); }
        .gap-2 { gap: 0.5rem; }
        .gap-3 { gap: 0.75rem; }
        .w-full { width: 100%; }
        .absolute { position: absolute; }
        .relative { position: relative; }
        .top-2 { top: 0.5rem; }
        .right-2 { right: 0.5rem; }
        .hover\\:opacity-100:hover { opacity: 1; }
      `}</style>
    </Modal>
  );
}
