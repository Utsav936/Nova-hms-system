import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import medicalRecordService from '../services/medicalRecordService';
import prescriptionService from '../services/prescriptionService';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import AddRecordModal from '../components/medical-records/AddRecordModal';
import IssuePrescriptionModal from '../components/medical-records/IssuePrescriptionModal';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MdAdd, 
  MdSearch, 
  MdVisibility, 
  MdHistory, 
  MdDescription, 
  MdMedication, 
  MdCalendarToday,
  MdPerson
} from 'react-icons/md';

export default function MedicalRecords() {
  const { user, isDoctor, isPatient } = useAuth();
  const [records, setRecords] = useState([]);
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPrescriptionModalOpen, setIsPrescriptionModalOpen] = useState(false);
  const { error } = useToast();

  const fetchData = async () => {
    setLoading(true);
    try {
      const [recordsRes, prescriptionsRes] = await Promise.all([
        medicalRecordService.getAll({ page: 1, limit: 20 }),
        prescriptionService.getAll({})
      ]);
      setRecords(recordsRes.data.data);
      setPrescriptions(prescriptionsRes.data.data);
    } catch (err) {
      error('Failed to fetch medical history.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Merge records and prescriptions into a single timeline
  const timelineData = [
    ...records.map(r => ({ ...r, timelineType: 'record', sortDate: new Date(r.record_date) })),
    ...prescriptions.map(p => ({ ...p, timelineType: 'prescription', sortDate: new Date(p.issued_at) }))
  ].sort((a, b) => b.sortDate - a.sortDate);

  const filteredTimeline = timelineData.filter(item => {
    const searchLower = search.toLowerCase();
    if (item.timelineType === 'record') {
      return item.diagnosis?.toLowerCase().includes(searchLower) || 
             item.patient_name?.toLowerCase().includes(searchLower);
    }
    return item.medication_name?.toLowerCase().includes(searchLower) || 
           item.patient_name?.toLowerCase().includes(searchLower);
  });

  return (
    <div className="records-page animate-fade-in">
      <div className="page-header mb-8">
        <div className="flex justify-between items-end">
          <div className="welcome-section">
            <div className="flex items-center gap-2 text-accent mb-2">
              <MdHistory size={24} />
              <span className="font-bold tracking-widest uppercase text-xs">Medical History</span>
            </div>
            <h1 className="text-4xl font-bold text-white mb-2">The Patient Journey</h1>
            <p className="text-secondary max-w-md">A chronological view of diagnoses, treatments, and medical milestones.</p>
          </div>
          
          <div className="header-actions flex gap-4">
            <div className="search-box-premium">
              <MdSearch size={20} className="text-muted" />
              <input 
                type="text" 
                placeholder="Search history..." 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            {isDoctor && (
              <div className="flex gap-2">
                <Button variant="outline" icon={<MdMedication />} onClick={() => setIsPrescriptionModalOpen(true)}>
                  Issue Prescription
                </Button>
                <Button icon={<MdAdd />} onClick={() => setIsModalOpen(true)}>
                  New Record
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="timeline-container">
        {loading ? (
          <div className="loading-state">
            <div className="skeleton h-64 rounded-3xl mb-6" />
            <div className="skeleton h-64 rounded-3xl mb-6" />
          </div>
        ) : filteredTimeline.length === 0 ? (
          <div className="empty-history text-center py-20 bg-card rounded-3xl border border-dashed border-border">
            <MdHistory size={64} className="mx-auto text-muted mb-4 opacity-20" />
            <h3 className="text-xl font-bold text-white mb-2">No History Recorded</h3>
            <p className="text-secondary">Start by adding a medical record or prescription.</p>
          </div>
        ) : (
          <div className="timeline-v-line">
            {filteredTimeline.map((item, index) => (
              <motion.div 
                key={item.id}
                initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className={`timeline-item ${item.timelineType === 'prescription' ? 'item-prescription' : 'item-record'}`}
              >
                <div className="timeline-marker">
                  {item.timelineType === 'record' ? <MdDescription /> : <MdMedication />}
                </div>
                
                <div className="timeline-content-card">
                  <div className="card-header">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <span className="date-tag">
                          <MdCalendarToday className="mr-2" />
                          {item.sortDate.toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })}
                        </span>
                        <h3 className="card-title mt-2">
                          {item.timelineType === 'record' ? item.diagnosis : item.medication_name}
                        </h3>
                      </div>
                      <span className={`type-badge ${item.timelineType}`}>
                        {item.timelineType}
                      </span>
                    </div>
                  </div>

                  <div className="card-body">
                    <p className="description-text">
                      {item.timelineType === 'record' ? item.notes : `Dosage: ${item.dosage} | Duration: ${item.duration}`}
                    </p>
                    
                    <div className="card-footer mt-6 flex justify-between items-center pt-4 border-t border-white/5">
                      <div className="meta-info">
                        <div className="flex items-center gap-2 text-xs text-muted">
                          <MdPerson />
                          <span>{item.timelineType === 'record' ? `Dr. ${item.doctor_name}` : `Prescribed by Dr. ${item.doctor_name}`}</span>
                        </div>
                      </div>
                      <Button variant="outline" size="sm" icon={<MdVisibility />}>
                        Details
                      </Button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      <style>{`
        .search-box-premium {
          display: flex; align-items: center; gap: 12px; background: rgba(255,255,255,0.03);
          border: 1px solid var(--color-border); padding: 0 20px; border-radius: var(--radius-full); width: 320px;
          transition: all 0.3s;
        }
        .search-box-premium:focus-within { border-color: var(--color-accent); background: rgba(255,255,255,0.06); }
        .search-box-premium input { background: transparent; border: none; color: white; width: 100%; height: 44px; outline: none; font-size: 14px; }
        
        .timeline-container { position: relative; padding: 20px 0; }
        .timeline-v-line { position: relative; }
        .timeline-v-line::before {
          content: ''; position: absolute; left: 24px; top: 0; bottom: 0; width: 2px;
          background: linear-gradient(to bottom, var(--color-accent) 0%, rgba(255,255,255,0.05) 100%);
        }

        .timeline-item { position: relative; padding-left: 70px; margin-bottom: 40px; }
        .timeline-marker {
          position: absolute; left: 0; top: 0; width: 50px; height: 50px; border-radius: 15px;
          background: var(--color-bg-card); border: 2px solid var(--color-border);
          display: flex; align-items: center; justify-content: center; font-size: 24px; color: var(--color-accent);
          box-shadow: 0 10px 20px rgba(0,0,0,0.2); z-index: 2;
        }
        .item-prescription .timeline-marker { color: var(--color-info); }

        .timeline-content-card {
          background: linear-gradient(145deg, rgba(30, 41, 59, 0.4) 0%, rgba(15, 23, 42, 0.6) 100%);
          backdrop-filter: blur(10px); border: 1px solid var(--color-border);
          border-radius: 24px; padding: 30px; transition: all 0.3s ease;
        }
        .timeline-content-card:hover { transform: translateX(10px); border-color: rgba(255,255,255,0.1); box-shadow: 0 20px 40px -20px rgba(0,0,0,0.5); }

        .date-tag {
          display: inline-flex; align-items: center; font-size: 11px; font-weight: bold;
          text-transform: uppercase; letter-spacing: 1px; color: var(--color-text-muted);
        }
        .card-title { font-size: 22px; font-weight: 800; color: white; }
        .type-badge {
          font-size: 10px; font-weight: bold; text-transform: uppercase; padding: 4px 12px;
          border-radius: var(--radius-full); letter-spacing: 1px;
        }
        .type-badge.record { background: var(--color-accent-soft); color: var(--color-accent); }
        .type-badge.prescription { background: var(--color-info-soft); color: var(--color-info); }

        .description-text { color: var(--color-text-secondary); line-height: 1.6; font-size: 15px; }

        .skeleton { background: rgba(255,255,255,0.05); animation: pulse 2s infinite; }
        @keyframes pulse { 0% { opacity: 0.5; } 50% { opacity: 1; } 100% { opacity: 0.5; } }
      `}</style>
      
      <AddRecordModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={fetchData}
      />

      <IssuePrescriptionModal
        isOpen={isPrescriptionModalOpen}
        onClose={() => setIsPrescriptionModalOpen(false)}
        onSuccess={fetchData}
      />
    </div>
  );
}
