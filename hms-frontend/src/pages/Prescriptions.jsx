import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import prescriptionService from '../services/prescriptionService';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import IssuePrescriptionModal from '../components/medical-records/IssuePrescriptionModal';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MdMedication, 
  MdAdd, 
  MdSearch, 
  MdFilterList, 
  MdSchedule, 
  MdPerson, 
  MdCheckCircle,
  MdInfo
} from 'react-icons/md';

export default function Prescriptions() {
  const { isDoctor, isPatient } = useAuth();
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { error } = useToast();

  const fetchPrescriptions = async () => {
    setLoading(true);
    try {
      const res = await prescriptionService.getAll({});
      setPrescriptions(res.data.data);
    } catch (err) {
      error('Failed to load prescriptions.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPrescriptions();
  }, []);

  const filteredPrescriptions = prescriptions.filter(p => 
    p.medication_name.toLowerCase().includes(search.toLowerCase()) ||
    p.patient_name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="prescriptions-page animate-fade-in">
      <div className="page-header flex justify-between items-end mb-8">
        <div>
          <div className="flex items-center gap-2 text-info mb-2">
            <MdMedication size={24} />
            <span className="font-bold tracking-widest uppercase text-xs">Clinical Pharmacy</span>
          </div>
          <h1 className="text-4xl font-bold text-white mb-2">Digital Prescriptions</h1>
          <p className="text-secondary max-w-md">Manage and track patient medications with digital accuracy.</p>
        </div>

        <div className="flex gap-4 items-center">
          <div className="search-box-premium">
            <MdSearch size={20} className="text-muted" />
            <input 
              type="text" 
              placeholder="Search medications or patients..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          {isDoctor && (
            <Button icon={<MdAdd />} onClick={() => setIsModalOpen(true)}>
              Issue New Script
            </Button>
          )}
        </div>
      </div>

      {loading ? (
        <div className="loading-grid">
          {[1,2,3].map(i => <div key={i} className="skeleton h-48 rounded-3xl mb-6" />)}
        </div>
      ) : (
        <div className="prescriptions-grid">
          <AnimatePresence>
            {filteredPrescriptions.map((script, index) => (
              <motion.div
                key={script.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card className="prescription-card-premium">
                  <div className="card-top flex justify-between items-start mb-4">
                    <div className="med-info">
                      <div className="flex items-center gap-2 text-info mb-1">
                        <MdMedication />
                        <span className="text-xs font-bold uppercase tracking-wider">Active Medication</span>
                      </div>
                      <h3 className="text-xl font-bold text-white">{script.medication_name}</h3>
                      <p className="text-accent text-sm font-semibold">{script.dosage}</p>
                    </div>
                    <div className={`status-pill ${script.status}`}>
                      {script.status === 'active' ? <MdCheckCircle /> : <MdSchedule />}
                      {script.status}
                    </div>
                  </div>

                  <div className="card-mid py-4 border-y border-white/5 my-4">
                    <div className="flex items-center gap-4">
                      <div className="info-item">
                        <span className="info-label">Frequency</span>
                        <span className="info-value">{script.frequency}</span>
                      </div>
                      <div className="info-divider" />
                      <div className="info-item">
                        <span className="info-label">Duration</span>
                        <span className="info-value">{script.duration}</span>
                      </div>
                    </div>
                  </div>

                  <div className="card-bottom flex justify-between items-center mt-4">
                    <div className="user-details flex items-center gap-3">
                      <div className="mini-avatar">{script.patient_name[0]}</div>
                      <div className="flex flex-col">
                        <span className="text-xs text-muted">Patient</span>
                        <span className="text-sm font-bold text-white">{script.patient_name}</span>
                      </div>
                    </div>
                    <div className="doctor-details text-right">
                      <span className="text-xs text-muted block">Prescribed by</span>
                      <span className="text-sm font-medium text-secondary">{script.doctor_name}</span>
                    </div>
                  </div>

                  {script.instructions && (
                    <div className="instructions-box mt-4 p-3 bg-white/5 rounded-xl flex gap-2">
                      <MdInfo className="text-info shrink-0 mt-1" />
                      <p className="text-xs text-secondary leading-relaxed">{script.instructions}</p>
                    </div>
                  )}
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>

          {filteredPrescriptions.length === 0 && (
            <div className="col-span-full py-20 text-center bg-card rounded-3xl border border-dashed border-border">
              <MdMedication size={64} className="mx-auto text-muted mb-4 opacity-20" />
              <h3 className="text-xl font-bold text-white mb-2">No Prescriptions Found</h3>
              <p className="text-secondary">Records will appear here once issued by a medical professional.</p>
            </div>
          )}
        </div>
      )}

      <IssuePrescriptionModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSuccess={fetchPrescriptions} 
      />

      <style jsx>{`
        .search-box-premium {
          display: flex; align-items: center; gap: 12px; background: rgba(255,255,255,0.03);
          border: 1px solid var(--color-border); padding: 0 20px; border-radius: var(--radius-full); width: 350px;
          transition: all 0.3s;
        }
        .search-box-premium:focus-within { border-color: var(--color-info); background: rgba(255,255,255,0.06); }
        .search-box-premium input { background: transparent; border: none; color: white; width: 100%; height: 44px; outline: none; font-size: 14px; }

        .prescriptions-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(380px, 1fr));
          gap: var(--space-6);
        }

        .prescription-card-premium {
          height: 100%;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          border: 1px solid var(--color-border);
          background: linear-gradient(145deg, rgba(30, 41, 59, 0.4) 0%, rgba(15, 23, 42, 0.6) 100%);
          backdrop-filter: blur(10px);
        }
        .prescription-card-premium:hover {
          transform: translateY(-8px);
          border-color: var(--color-info-soft);
          box-shadow: 0 20px 40px -20px rgba(0,0,0,0.5);
        }

        .status-pill {
          display: flex; align-items: center; gap: 6px; padding: 4px 12px; border-radius: var(--radius-full);
          font-size: 10px; font-weight: bold; text-transform: uppercase; letter-spacing: 1px;
        }
        .status-pill.active { background: var(--color-success-soft); color: var(--color-success); }
        .status-pill.completed { background: var(--color-text-muted); color: white; opacity: 0.5; }

        .info-item { display: flex; flex-direction: column; }
        .info-label { font-size: 10px; text-transform: uppercase; color: var(--color-text-muted); font-weight: bold; margin-bottom: 2px; }
        .info-value { font-size: 14px; color: white; font-weight: 600; }
        .info-divider { width: 1px; height: 24px; background: rgba(255,255,255,0.1); }

        .mini-avatar {
          width: 36px; height: 36px; border-radius: 12px; background: var(--color-info-soft);
          color: var(--color-info); display: flex; align-items: center; justify-content: center;
          font-weight: bold; font-size: 16px;
        }

        .instructions-box p { font-style: italic; }

        .skeleton { background: rgba(255,255,255,0.05); animation: pulse 2s infinite; }
        @keyframes pulse { 0% { opacity: 0.5; } 50% { opacity: 1; } 100% { opacity: 0.5; } }
      `}</style>
    </div>
  );
}
