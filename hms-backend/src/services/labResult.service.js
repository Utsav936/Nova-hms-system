const { db } = require('../config/firebase');
const ApiError = require('../utils/ApiError');

class LabResultService {
  async getAll({ patient_id, doctor_id, user }) {
    let query = db.collection('lab_results').where('deleted_at', '==', null);

    // Role-based scoping
    if (user.role === 'doctor') {
      query = query.where('doctor_id', '==', user.id);
    } else if (user.role === 'patient') {
      query = query.where('patient_id', '==', user.id);
    }

    if (patient_id) query = query.where('patient_id', '==', patient_id);
    if (doctor_id) query = query.where('doctor_id', '==', doctor_id);

    const snapshot = await query.get();
    let results = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

    // Sort by date (desc)
    results.sort((a, b) => (b.test_date?.toDate?.() || 0) - (a.test_date?.toDate?.() || 0));

    return results;
  }

  async create(data, doctorUserId) {
    const doctorDoc = await db.collection('doctors').doc(doctorUserId).get();
    if (!doctorDoc.exists) throw ApiError.forbidden('Only doctors can record lab results.');

    const patientDoc = await db.collection('patients').doc(data.patient_id).get();
    if (!patientDoc.exists) throw ApiError.notFound('Patient not found.');

    const resultRef = db.collection('lab_results').doc();
    const resultPayload = {
      ...data,
      doctor_id: doctorUserId,
      doctor_name: `Dr. ${doctorDoc.data().first_name} ${doctorDoc.data().last_name}`,
      patient_name: `${patientDoc.data().first_name} ${patientDoc.data().last_name}`,
      test_date: new Date(),
      created_at: new Date(),
      updated_at: new Date(),
      deleted_at: null
    };

    await resultRef.set(resultPayload);
    return { id: resultRef.id, ...resultPayload };
  }

  async getById(id) {
    const doc = await db.collection('lab_results').doc(id).get();
    if (!doc.exists || doc.data().deleted_at) {
      throw ApiError.notFound('Lab result not found.');
    }
    return { id: doc.id, ...doc.data() };
  }
}

module.exports = new LabResultService();
