const { db } = require('../config/firebase');
const ApiError = require('../utils/ApiError');

class PrescriptionService {
  async getAll({ patient_id, doctor_id, user }) {
    let query = db.collection('prescriptions').where('deleted_at', '==', null);

    // Role-based scoping
    if (user.role === 'doctor') {
      query = query.where('doctor_id', '==', user.id);
    } else if (user.role === 'patient') {
      query = query.where('patient_id', '==', user.id);
    }

    if (patient_id) query = query.where('patient_id', '==', patient_id);
    if (doctor_id) query = query.where('doctor_id', '==', doctor_id);

    const snapshot = await query.get();
    let prescriptions = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

    // Sort by date (desc)
    prescriptions.sort((a, b) => (b.issued_at?.toDate?.() || 0) - (a.issued_at?.toDate?.() || 0));

    return prescriptions;
  }

  async getById(id) {
    const doc = await db.collection('prescriptions').doc(id).get();
    if (!doc.exists || doc.data().deleted_at) {
      throw ApiError.notFound('Prescription not found.');
    }
    return { id: doc.id, ...doc.data() };
  }

  async create(data, doctorUserId) {
    const doctorDoc = await db.collection('doctors').doc(doctorUserId).get();
    if (!doctorDoc.exists) throw ApiError.forbidden('Only doctors can issue prescriptions.');

    const patientDoc = await db.collection('patients').doc(data.patient_id).get();
    if (!patientDoc.exists) throw ApiError.notFound('Patient not found.');

    const prescriptionRef = db.collection('prescriptions').doc();
    const prescriptionPayload = {
      ...data,
      doctor_id: doctorUserId,
      doctor_name: `Dr. ${doctorDoc.data().first_name} ${doctorDoc.data().last_name}`,
      patient_name: `${patientDoc.data().first_name} ${patientDoc.data().last_name}`,
      status: 'active',
      issued_at: new Date(),
      created_at: new Date(),
      updated_at: new Date(),
      deleted_at: null
    };

    await prescriptionRef.set(prescriptionPayload);
    return { id: prescriptionRef.id, ...prescriptionPayload };
  }

  async updateStatus(id, status) {
    const prescriptionRef = db.collection('prescriptions').doc(id);
    const doc = await prescriptionRef.get();
    if (!doc.exists) throw ApiError.notFound('Prescription not found.');

    await prescriptionRef.update({ 
      status, 
      updated_at: new Date() 
    });
    return { id, ...doc.data(), status };
  }
}

module.exports = new PrescriptionService();
