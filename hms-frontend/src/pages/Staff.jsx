import { useState, useEffect } from 'react';
import { useToast } from '../contexts/ToastContext';
import staffService from '../services/staffService';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import StaffModal from '../components/staff/StaffModal';
import Skeleton, { SkeletonCard } from '../components/common/Skeleton';
import { motion, AnimatePresence } from 'framer-motion';
import { MdAdd, MdSearch, MdEdit, MdVisibility, MdDelete, MdPerson } from 'react-icons/md';

export default function Staff() {
  const [staffList, setStaffList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const { error, success } = useToast();

  const fetchStaff = async () => {
    setLoading(true);
    try {
      const res = await staffService.getAll({ search });
      setStaffList(res.data.data);
    } catch (err) {
      error('Failed to fetch staff directory.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStaff();
  }, [search]);

  const handleAdd = () => {
    setSelectedStaff(null);
    setIsModalOpen(true);
  };

  const handleEdit = (staff) => {
    setSelectedStaff(staff);
    setIsModalOpen(true);
  };

  const handleSaveStaff = async (formData) => {
    setIsSaving(true);
    try {
      if (selectedStaff) {
        await staffService.update(selectedStaff.id, formData);
        success('Staff member updated successfully.');
      } else {
        await staffService.create(formData);
        success('Staff member created successfully.');
      }
      setIsModalOpen(false);
      fetchStaff();
    } catch (err) {
      error(err.response?.data?.message || 'Failed to save staff member.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to remove this staff member?')) {
      try {
        await staffService.delete(id);
        success('Staff member removed successfully.');
        fetchStaff();
      } catch (err) {
        error(err.response?.data?.message || 'Failed to remove staff.');
      }
    }
  };

  return (
    <div className="staff-page animate-fade-in">
      <div className="page-header flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white mb-1">Staff Directory</h1>
          <p className="text-secondary text-sm">View and manage all hospital personnel records</p>
        </div>
        <Button icon={<MdAdd />} onClick={handleAdd}>
          Add Staff
        </Button>
      </div>

      <Card>
        <div className="flex justify-between items-center mb-4">
          <div className="search-box">
            <MdSearch size={20} className="text-muted" />
            <input 
              type="text" 
              placeholder="Search by name or role..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div 
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4"
            >
              {[...Array(4)].map((_, i) => <SkeletonCard key={i} />)}
            </motion.div>
          ) : staffList.length === 0 ? (
            <motion.div 
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="p-8 text-center text-muted"
            >
              <p>No staff records found.</p>
            </motion.div>
          ) : (
            <motion.div 
              key="table"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="table-responsive"
            >
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Employee</th>
                    <th>Role / Dept</th>
                    <th>Contact</th>
                    <th>Shift Timing</th>
                    <th className="text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {staffList.map(staff => (
                    <tr key={staff.id}>
                      <td>
                        <div className="flex items-center gap-3">
                          <div className="avatar-placeholder">
                            <MdPerson size={20} />
                          </div>
                          <div>
                            <div className="font-semibold text-white">
                              {staff.first_name} {staff.last_name}
                            </div>
                            <div className="text-xs text-muted max-w-xs truncate" title={staff.description}>
                              {staff.description || 'No description provided'}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td>
                        <div className="text-sm font-medium">{staff.role_title}</div>
                        <div className="text-xs text-muted">{staff.department_id ? 'Assigned' : 'General'}</div>
                      </td>
                      <td>
                        <div className="text-sm">{staff.contact_number || 'N/A'}</div>
                        <div className="text-xs text-muted">{staff.email || 'N/A'}</div>
                      </td>
                      <td>
                        <span className="badge">{staff.shift_timing || 'Flexible'}</span>
                      </td>
                      <td className="text-right">
                        <div className="flex justify-end gap-2">
                          <button className="icon-btn-sm" title="View" onClick={() => handleEdit(staff)}><MdVisibility /></button>
                          <button className="icon-btn-sm" title="Edit" onClick={() => handleEdit(staff)}><MdEdit /></button>
                          <button className="icon-btn-sm text-danger" title="Delete" onClick={() => handleDelete(staff.id)}><MdDelete /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </motion.div>
          )}
        </AnimatePresence>
      </Card>

      <StaffModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveStaff}
        loading={isSaving}
        initialData={selectedStaff}
      />

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
          outline: none;
        }
        .data-table { width: 100%; border-collapse: collapse; }
        .data-table th, .data-table td { padding: var(--space-3) var(--space-4); text-align: left; border-bottom: 1px solid var(--color-border); vertical-align: middle; }
        .data-table th { font-size: var(--fs-xs); text-transform: uppercase; color: var(--color-text-muted); font-weight: var(--fw-semibold); }
        .data-table tr:hover { background: rgba(255,255,255,0.02); }
        
        .badge { display: inline-block; padding: 2px 8px; border-radius: var(--radius-full); font-size: 11px; background: var(--color-bg-input); color: var(--color-text-secondary); letter-spacing: 0.3px; }
        
        .avatar-placeholder {
          width: 36px; height: 36px; border-radius: var(--radius-full);
          background: var(--color-bg-input); border: 1px solid var(--color-border);
          display: flex; align-items: center; justify-content: center;
          color: var(--color-text-muted); flex-shrink: 0;
        }
        
        .icon-btn-sm {
          display: inline-flex; align-items: center; justify-content: center; width: 28px; height: 28px;
          border-radius: var(--radius-md); background: transparent; border: 1px solid transparent; color: var(--color-text-muted); transition: all 0.2s;
        }
        .icon-btn-sm:hover {
          background: var(--color-bg-input); color: var(--color-text-primary); border-color: var(--color-border);
        }
        .icon-btn-sm.text-danger:hover { color: var(--color-danger); border-color: var(--color-danger-soft); background: var(--color-danger-soft); }

        .grid { display: grid; }
        .grid-cols-1 { grid-template-columns: repeat(1, minmax(0, 1fr)); }
        @media (min-width: 768px) {
          .grid-cols-2 { grid-template-columns: repeat(2, minmax(0, 1fr)); }
        }
      `}</style>
    </div>
  );
}
