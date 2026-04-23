import { useState, useEffect } from 'react';
import { useToast } from '../contexts/ToastContext';
import doctorService from '../services/doctorService';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import AddDoctorModal from '../components/doctors/AddDoctorModal';
import { MdAdd, MdSearch, MdEdit, MdDelete } from 'react-icons/md';

export default function Doctors() {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { error, success } = useToast();

  const fetchDoctors = async () => {
    setLoading(true);
    try {
      const res = await doctorService.getAll({ page, limit: 10, search });
      setDoctors(res.data.data);
    } catch (err) {
      error('Failed to fetch doctors.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDoctors();
  }, [page, search]);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to deactivate this doctor?')) {
      try {
        await doctorService.delete(id);
        success('Doctor deactivated successfully.');
        fetchDoctors();
      } catch (err) {
        error(err.response?.data?.message || 'Failed to deactivate doctor.');
      }
    }
  };

  return (
    <div className="doctors-page animate-fade-in">
      <div className="page-header flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white mb-1">Doctors Directory</h1>
          <p className="text-secondary text-sm">Manage medical staff and specialties</p>
        </div>
        <Button icon={<MdAdd />} onClick={() => setIsModalOpen(true)}>
          Add Doctor
        </Button>
      </div>

      <Card>
        <div className="flex justify-between items-center mb-4">
          <div className="search-box">
            <MdSearch size={20} className="text-muted" />
            <input 
              type="text" 
              placeholder="Search by name, specialty..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        {loading && <div className="p-8 text-center text-secondary">Loading doctors...</div>}
        
        {!loading && doctors.length === 0 && (
          <div className="p-8 text-center text-muted">
            <p>No doctors found.</p>
          </div>
        )}

        {!loading && doctors.length > 0 && (
          <div className="table-responsive">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Doctor Info</th>
                  <th>Department</th>
                  <th>Specialization</th>
                  <th>Consultation Fee</th>
                  <th>Status</th>
                  <th className="text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {doctors.map(doctor => (
                  <tr key={doctor.id}>
                    <td>
                      <div className="flex items-center gap-3">
                        <div className="avatar">
                           {doctor.first_name.charAt(0)}{doctor.last_name.charAt(0)}
                        </div>
                        <div>
                          <div className="font-semibold text-white">
                            Dr. {doctor.first_name} {doctor.last_name}
                          </div>
                          <div className="text-xs text-muted">{doctor.email} • {doctor.phone}</div>
                          {doctor.bio && (
                            <div className="text-xs text-secondary mt-1 max-w-sm truncate" style={{ maxWidth: '300px' }}>
                              {doctor.bio}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td>{doctor.department_name}</td>
                    <td>
                      <div>{doctor.specialization}</div>
                      <div className="text-xs text-muted">{doctor.experience_years} years exp.</div>
                    </td>
                    <td>${doctor.consultation_fee}</td>
                    <td>
                      <span className={`badge ${doctor.is_available ? 'badge-success' : 'badge-danger'}`}>
                         {doctor.is_available ? 'Available' : 'Unavailable'}
                      </span>
                    </td>
                    <td className="text-right">
                      <div className="flex justify-end gap-2">
                        <button className="icon-btn-sm" title="Edit"><MdEdit /></button>
                        <button className="icon-btn-sm text-danger" title="Delete" onClick={() => handleDelete(doctor.id)}><MdDelete /></button>
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
        .search-box input { background: transparent; border: none; color: var(--color-text-primary); width: 100%; }
        
        .data-table { width: 100%; border-collapse: collapse; }
        .data-table th, .data-table td { padding: var(--space-3) var(--space-4); text-align: left; border-bottom: 1px solid var(--color-border); vertical-align: middle; }
        .data-table th { font-size: var(--fs-xs); text-transform: uppercase; color: var(--color-text-muted); font-weight: var(--fw-semibold); }
        .data-table tr:hover { background: rgba(255,255,255,0.02); }
        
        .avatar {
           width: 36px; height: 36px; border-radius: var(--radius-full);
           background: var(--color-bg-input); display: flex; align-items: center; justify-content: center;
           color: var(--color-accent); font-weight: var(--fw-semibold); font-size: var(--fs-sm);
        }

        .badge { display: inline-block; padding: 2px 8px; border-radius: var(--radius-full); font-size: 11px; text-transform: uppercase; }
        .badge-success { background: var(--color-success-soft); color: var(--color-success); }
        .badge-danger { background: var(--color-danger-soft); color: var(--color-danger); }
        
        .icon-btn-sm {
          display: inline-flex; align-items: center; justify-content: center; width: 28px; height: 28px;
          border-radius: var(--radius-md); background: transparent; border: 1px solid transparent; color: var(--color-text-muted); transition: all 0.2s;
        }
        .icon-btn-sm:hover { background: var(--color-bg-input); color: var(--color-text-primary); border-color: var(--color-border); }
        .icon-btn-sm.text-danger:hover { color: var(--color-danger); border-color: var(--color-danger-soft); background: var(--color-danger-soft); }
      `}</style>
      <AddDoctorModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={fetchDoctors}
      />
    </div>
  );
}
