const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const xss = require('xss-clean');
const hpp = require('hpp');

const corsOptions = require('./config/cors');
const { apiLimiter } = require('./middleware/rateLimiter');
const errorHandler = require('./middleware/errorHandler');
const ApiError = require('./utils/ApiError');

// Route imports
const authRoutes = require('./routes/auth.routes');
const userRoutes = require('./routes/user.routes');
const departmentRoutes = require('./routes/department.routes');
const doctorRoutes = require('./routes/doctor.routes');
const patientRoutes = require('./routes/patient.routes');
const appointmentRoutes = require('./routes/appointment.routes');
const medicalRecordRoutes = require('./routes/medicalRecord.routes');
const dashboardRoutes = require('./routes/dashboard.routes');
const staffRoutes = require('./routes/staff.routes');
const prescriptionRoutes = require('./routes/prescription.routes');
const labResultRoutes = require('./routes/labResult.routes');

const app = express();

// ──── Security Headers ────
app.use(helmet());

// ──── CORS ────
app.use(cors(corsOptions));

// ──── Cookie Parser ────
app.use(cookieParser());

// ──── Rate Limiting ────
app.use('/api/', apiLimiter);

// ──── Request Logging ────
app.use(morgan('dev'));

// ──── Body Parsing ────
app.use(express.json({ limit: '100kb' })); // Max body size 100kb to prevent payload poisoning
app.use(express.urlencoded({ extended: true, limit: '100kb' }));

// ──── Data Sanitization ────
// Data sanitization against XSS
app.use(xss());

// Prevent parameter pollution
app.use(hpp());

// ──── Health Check ────
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'Nova HMS API is running',
    timestamp: new Date().toISOString(),
  });
});

// ──── API Routes ────
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/departments', departmentRoutes);
app.use('/api/v1/doctors', doctorRoutes);
app.use('/api/v1/patients', patientRoutes);
app.use('/api/v1/appointments', appointmentRoutes);
app.use('/api/v1/medical-records', medicalRecordRoutes);
app.use('/api/v1/dashboard', dashboardRoutes);
app.use('/api/v1/staff', staffRoutes);
app.use('/api/v1/prescriptions', prescriptionRoutes);
app.use('/api/v1/lab-results', labResultRoutes);

// ──── 404 Handler ────
app.use((req, res, next) => {
  next(ApiError.notFound(`Route ${req.originalUrl} not found`));
});

// ──── Global Error Handler ────
app.use(errorHandler);

module.exports = app;
