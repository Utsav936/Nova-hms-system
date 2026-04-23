import { useState, useEffect } from 'react';
import { useToast } from '../contexts/ToastContext';
import patientService from '../services/patientService';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import AddPatientModal from '../components/patients/AddPatientModal';
import { MdAdd, MdSearch, MdEdit, MdVisibility, MdDelete } from 'react-icons/md';

export default function Patients() {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { error, success } = useToast();

  const fetchPatients = async () => {
    setLoading(true);
    try {
      const res = await patientService.getAll({ page, limit: 10, search });
      setPatients(res.data.data);
    } catch (err) {
      error('Failed to fetch patients.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPatients();
  }, [page, search]);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this patient?')) {
      try {
        await patientService.delete(id);
        success('Patient deleted successfully.');
        fetchPatients();
      } catch (err) {
        error(err.response?.data?.message || 'Failed to delete patient.');
      }
    }
  };

  return (
    <div className="patients-page animate-fade-in">
      <div className="page-header flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white mb-1">Patients</h1>
          <p className="text-secondary text-sm">Manage patient records and information</p>
        </div>
        <Button icon={<MdAdd />} onClick={() => setIsModalOpen(true)}>
          Add Patient
        </Button>
      </div>

      <Card>
        <div className="flex justify-between items-center mb-4">
          <div className="search-box">
            <MdSearch size={20} className="text-muted" />
            <input 
              type="text" 
              placeholder="Search patients..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        {loading && <div className="p-8 text-center text-secondary">Loading patients...</div>}
        
        {!loading && patients.length === 0 && (
          <div className="p-8 text-center text-muted">
            <p>No patients found.</p>
          </div>
        )}

        {!loading && patients.length > 0 && (
          <div className="table-responsive">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>ID</th>
                  <th>Contact</th>
                  <th>Gender/Blood</th>
                  <th className="text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {patients.map(patient => (
                  <tr key={patient.id}>
                    <td>
                      <div className="font-semibold text-white">
                        {patient.first_name} {patient.last_name}
                      </div>
                      <div className="text-xs text-muted">{patient.date_of_birth && new Date(patient.date_of_birth).toLocaleDateString()}</div>
                    </td>
                    <td className="text-xs text-muted">{patient.id.substring(0, 8)}</td>
                    <td>
                      <div className="text-sm">{patient.phone || 'N/A'}</div>
                      <div className="text-xs text-muted">{patient.email || 'N/A'}</div>
                    </td>
                    <td>
                      <div className="flex gap-2">
                        <span className="badge">{patient.gender || 'N/A'}</span>
                        <span className="badge badge-accent">{patient.blood_group || 'N/A'}</span>
                      </div>
                    </td>
                    <td className="text-right">
                      <div className="flex justify-end gap-2">
                        <button className="icon-btn-sm" title="View"><MdVisibility /></button>
                        <button className="icon-btn-sm" title="Edit"><MdEdit /></button>
                        <button className="icon-btn-sm text-danger" title="Delete" onClick={() => handleDelete(patient.id)}><MdDelete /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      <style>{`
        .search-box {
          display: flex;
          align-items: center;
          gap: var(--space-2);
          background: var(--color-bg-input);
          border: 1px solid var(--color-border);
          padding: var(--space-2) var(--space-3);
          border-radius: var(--radius-md);
          width: 300px;
        }
        .search-box input {
          background: transparent;
          border: none;
          color: var(--color-text-primary);
          width: 100%;
        }
        .data-table { width: 100%; border-collapse: collapse; }
        .data-table th, .data-table td { padding: var(--space-3) var(--space-4); text-align: left; border-bottom: 1px solid var(--color-border); }
        .data-table th { font-size: var(--fs-xs); text-transform: uppercase; color: var(--color-text-muted); font-weight: var(--fw-semibold); }
        .data-table tr:hover { background: rgba(255,255,255,0.02); }
        
        .badge { display: inline-block; padding: 2px 8px; border-radius: var(--radius-full); font-size: 11px; background: var(--color-bg-input); color: var(--color-text-secondary); text-transform: capitalize; }
        .badge-accent { background: var(--color-accent-soft); color: var(--color-accent); }
        
        .icon-btn-sm {
          display: inline-flex; align-items: center; justify-content: center; width: 28px; height: 28px;
          border-radius: var(--radius-md); background: transparent; border: 1px solid transparent; color: var(--color-text-muted); transition: all 0.2s;
        }
        .icon-btn-sm:hover {
          background: var(--color-bg-input); color: var(--color-text-primary); border-color: var(--color-border);
        }
        .icon-btn-sm.text-danger:hover { color: var(--color-danger); border-color: var(--color-danger-soft); background: var(--color-danger-soft); }
      `}</style>
      <AddPatientModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={fetchPatients}
      />
    </div>
  );
}
