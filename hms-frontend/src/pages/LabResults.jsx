import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import labResultService from '../services/labResultService';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MdScience, 
  MdAdd, 
  MdSearch, 
  MdHistory, 
  MdTrendingUp, 
  MdWarning, 
  MdCheckCircle,
  MdDescription,
  MdDateRange
} from 'react-icons/md';

export default function LabResults() {
  const { isDoctor } = useAuth();
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const { error } = useToast();

  const fetchResults = async () => {
    setLoading(true);
    try {
      const res = await labResultService.getAll({});
      setResults(res.data.data);
    } catch (err) {
      error('Failed to load laboratory reports.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResults();
  }, []);

  const filteredResults = results.filter(r => 
    r.test_name.toLowerCase().includes(search.toLowerCase()) ||
    r.patient_name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="lab-results-page animate-fade-in">
      <div className="page-header flex justify-between items-end mb-8">
        <div>
          <div className="flex items-center gap-2 text-warning mb-2">
            <MdScience size={24} />
            <span className="font-bold tracking-widest uppercase text-xs">Diagnostic Center</span>
          </div>
          <h1 className="text-4xl font-bold text-white mb-2">Laboratory Reports</h1>
          <p className="text-secondary max-w-md">Precision diagnostics and clinical insights for better care.</p>
        </div>

        <div className="flex gap-4 items-center">
          <div className="search-box-premium">
            <MdSearch size={20} className="text-muted" />
            <input 
              type="text" 
              placeholder="Search reports or patients..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          {isDoctor && (
            <Button icon={<MdAdd />} onClick={() => {}}>
              Record New Result
            </Button>
          )}
        </div>
      </div>

      {loading ? (
        <div className="loading-grid">
          {[1,2,3].map(i => <div key={i} className="skeleton h-48 rounded-3xl mb-6" />)}
        </div>
      ) : (
        <div className="results-grid">
          <AnimatePresence>
            {filteredResults.map((report, index) => (
              <motion.div
                key={report.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card className="lab-card-premium">
                  <div className="card-top flex justify-between items-start mb-6">
                    <div className="report-info">
                      <h3 className="text-2xl font-bold text-white">{report.test_name}</h3>
                      <div className="flex items-center gap-2 text-xs text-muted mt-1">
                        <MdDateRange />
                        <span>{new Date(report.test_date?.toDate?.() || report.test_date).toLocaleDateString()}</span>
                      </div>
                    </div>
                    <div className={`result-status ${report.is_abnormal ? 'abnormal' : 'normal'}`}>
                      {report.is_abnormal ? <MdWarning /> : <MdCheckCircle />}
                      {report.is_abnormal ? 'Abnormal' : 'Normal'}
                    </div>
                  </div>

                  <div className="result-display py-6 px-4 bg-white/5 rounded-2xl mb-6">
                    <div className="flex items-end gap-2">
                      <span className="text-4xl font-bold text-white">{report.value}</span>
                      <span className="text-sm text-secondary mb-1 font-medium">{report.unit}</span>
                    </div>
                    <div className="reference-range mt-2 flex justify-between text-xs">
                      <span className="text-muted">Ref Range</span>
                      <span className="text-secondary font-bold">{report.reference_range}</span>
                    </div>
                  </div>

                  <div className="card-bottom flex justify-between items-center">
                    <div className="user-meta flex items-center gap-3">
                      <div className="mini-avatar">{report.patient_name[0]}</div>
                      <div>
                        <span className="text-xs text-muted block leading-none mb-1">Patient</span>
                        <span className="text-sm font-bold text-white">{report.patient_name}</span>
                      </div>
                    </div>
                    <Button variant="outline" size="sm" icon={<MdDescription />}>Report</Button>
                  </div>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>

          {filteredResults.length === 0 && (
            <div className="col-span-full py-20 text-center bg-card rounded-3xl border border-dashed border-border">
              <MdScience size={64} className="mx-auto text-muted mb-4 opacity-20" />
              <h3 className="text-xl font-bold text-white mb-2">No Diagnostic Reports</h3>
              <p className="text-secondary">All laboratory findings will be centralized here.</p>
            </div>
          )}
        </div>
      )}

      <style jsx>{`
        .search-box-premium {
          display: flex; align-items: center; gap: 12px; background: rgba(255,255,255,0.03);
          border: 1px solid var(--color-border); padding: 0 20px; border-radius: var(--radius-full); width: 350px;
          transition: all 0.3s;
        }
        .search-box-premium:focus-within { border-color: var(--color-warning); background: rgba(255,255,255,0.06); }
        .search-box-premium input { background: transparent; border: none; color: white; width: 100%; height: 44px; outline: none; font-size: 14px; }

        .results-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
          gap: var(--space-6);
        }

        .lab-card-premium {
          height: 100%;
          transition: all 0.3s ease;
          border: 1px solid var(--color-border);
          background: linear-gradient(165deg, rgba(30, 41, 59, 0.4) 0%, rgba(15, 23, 42, 0.6) 100%);
        }
        .lab-card-premium:hover {
          transform: translateY(-8px);
          border-color: var(--color-warning-soft);
          box-shadow: 0 20px 40px -20px rgba(0,0,0,0.5);
        }

        .result-status {
          display: flex; align-items: center; gap: 6px; padding: 4px 12px; border-radius: var(--radius-full);
          font-size: 10px; font-weight: bold; text-transform: uppercase; letter-spacing: 1px;
        }
        .result-status.normal { background: var(--color-success-soft); color: var(--color-success); }
        .result-status.abnormal { background: var(--color-danger-soft); color: var(--color-danger); }

        .mini-avatar {
          width: 32px; height: 32px; border-radius: 10px; background: var(--color-warning-soft);
          color: var(--color-warning); display: flex; align-items: center; justify-content: center;
          font-weight: bold; font-size: 14px;
        }

        .skeleton { background: rgba(255,255,255,0.05); animation: pulse 2s infinite; }
        @keyframes pulse { 0% { opacity: 0.5; } 50% { opacity: 1; } 100% { opacity: 0.5; } }
      `}</style>
    </div>
  );
}
