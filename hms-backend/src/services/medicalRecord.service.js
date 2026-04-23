const { db } = require('../config/firebase');
const ApiError = require('../utils/ApiError');

class MedicalRecordService {
  async getAll({ page = 1, limit = 20, patient_id, user }) {
    let query = db.collection('medical_records').where('deleted_at', '==', null);

    // Role-based scoping
    if (user.role === 'doctor') {
      query = query.where('doctor_id', '==', user.id);
    } else if (user.role === 'patient') {
      query = query.where('patient_id', '==', user.id);
    }

    if (patient_id) query = query.where('patient_id', '==', patient_id);

    const snapshot = await query.get();
    let records = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

    // Sort by date (desc)
    records.sort((a, b) => (b.record_date?.toDate?.() || 0) - (a.record_date?.toDate?.() || 0));

    const total = records.length;
    const startIndex = (page - 1) * limit;
    const paginated = records.slice(startIndex, startIndex + limit);

    return {
      records: paginated,
      meta: { 
        page: parseInt(page), 
        limit: parseInt(limit), 
        total, 
        pages: Math.ceil(total / limit) 
      },
    };
  }

  async getById(id) {
    const doc = await db.collection('medical_records').doc(id).get();
    if (!doc.exists || doc.data().deleted_at) {
      throw ApiError.notFound('Medical record not found.');
    }

    return { id: doc.id, ...doc.data() };
  }

  async getByPatientId(patientId) {
    const snapshot = await db.collection('medical_records')
      .where('patient_id', '==', patientId)
      .where('deleted_at', '==', null)
      .get();

    let records = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    records.sort((a, b) => (b.record_date?.toDate?.() || 0) - (a.record_date?.toDate?.() || 0));
    return records;
  }

  async create(data, doctorUserId) {
    const doctorDoc = await db.collection('doctors').doc(doctorUserId).get();
    if (!doctorDoc.exists || doctorDoc.data().deleted_at) {
      throw ApiError.forbidden('Only doctors can create medical records.');
    }

    const patientDoc = await db.collection('patients').doc(data.patient_id).get();
    if (!patientDoc.exists) throw ApiError.notFound('Patient not found.');

    const recordRef = db.collection('medical_records').doc();
    const recordPayload = {
      ...data,
      doctor_id: doctorUserId,
      doctor_name: `${doctorDoc.data().first_name} ${doctorDoc.data().last_name}`,
      patient_name: `${patientDoc.data().first_name} ${patientDoc.data().last_name}`,
      record_date: new Date(),
      created_at: new Date(),
      updated_at: new Date(),
      deleted_at: null
    };

    await recordRef.set(recordPayload);
    return { id: recordRef.id, ...recordPayload };
  }

  async update(id, data, doctorUserId) {
    const recordRef = db.collection('medical_records').doc(id);
    const doc = await recordRef.get();
    
    if (!doc.exists || doc.data().deleted_at) {
      throw ApiError.notFound('Medical record not found.');
    }

    if (doc.data().doctor_id !== doctorUserId) {
      throw ApiError.forbidden('You can only edit records you created.');
    }

    const updateData = { ...data, updated_at: new Date() };
    await recordRef.update(updateData);
    
    return { id, ...doc.data(), ...updateData };
  }
}

module.exports = new MedicalRecordService();

