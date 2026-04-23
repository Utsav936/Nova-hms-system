import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './guards/ProtectedRoute';
import RoleGuard from './guards/RoleGuard';

// Layouts
import DashboardLayout from './components/layout/DashboardLayout';

import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import Dashboard from './pages/Dashboard';
import Patients from './pages/Patients';
import Doctors from './pages/Doctors';
import Staff from './pages/Staff';
import Appointments from './pages/Appointments';
import MedicalRecords from './pages/MedicalRecords';
import Prescriptions from './pages/Prescriptions';
import LabResults from './pages/LabResults';

// Pages (Placeholders for now)
const Unauthorized = () => <div className="p-8 text-center"><h1 className="text-2xl text-danger mb-4">403 - Unauthorized</h1><p>You do not have permission to view this page.</p></div>;
const NotFound = () => <div className="p-8 text-center"><h1 className="text-2xl mb-4">404 - Not Found</h1><p>The page you are looking for does not exist.</p></div>;

function App() {
  return (
    <Routes>
      {/* Public / Landing Routes */}
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Landing />} />
      <Route path="/register" element={<Landing />} />
      <Route path="/forgot-password" element={<Landing />} />

      {/* Protected Routes */}
      <Route element={<ProtectedRoute />}>
        <Route element={<DashboardLayout />}>
          {/* All authenticated users */}
          <Route path="/dashboard" element={<Dashboard />} />

          {/* Admin, Doctor, Receptionist */}
          <Route element={<RoleGuard roles={['admin', 'doctor', 'receptionist']} />}>
            <Route path="/patients/*" element={<Patients />} />
          </Route>

          {/* Admin, Doctor, Receptionist, Patient */}
          <Route element={<RoleGuard roles={['admin', 'doctor', 'receptionist', 'patient']} />}>
            <Route path="/appointments/*" element={<Appointments />} />
          </Route>

          {/* Admin Only */}
          <Route element={<RoleGuard roles={['admin']} />}>
            <Route path="/doctors/*" element={<Doctors />} />
            <Route path="/staff/*" element={<Staff />} />
          </Route>

          {/* Doctor & Patient access to medical data */}
          <Route element={<RoleGuard roles={['admin', 'doctor', 'patient']} />}>
            <Route path="/medical-records/*" element={<MedicalRecords />} />
            <Route path="/prescriptions/*" element={<Prescriptions />} />
            <Route path="/lab-results/*" element={<LabResults />} />
          </Route>
        </Route>
      </Route>

      {/* Error Routes */}
      <Route path="/unauthorized" element={<Unauthorized />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;
