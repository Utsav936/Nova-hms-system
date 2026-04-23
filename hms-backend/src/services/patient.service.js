const { db } = require('../config/firebase');
const ApiError = require('../utils/ApiError');

class PatientService {
  async getAll({ page = 1, limit = 20, blood_group, gender, search }) {
    let query = db.collection('patients').where('deleted_at', '==', null);

    if (blood_group) query = query.where('blood_group', '==', blood_group);
    if (gender) query = query.where('gender', '==', gender);

    const snapshot = await query.get();
    let patients = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

    // Apply search filter in-memory for basic "premium" search feel
    if (search) {
      const searchLower = search.toLowerCase();
      patients = patients.filter(doc => 
        doc.first_name?.toLowerCase().includes(searchLower) ||
        doc.last_name?.toLowerCase().includes(searchLower) ||
        doc.phone?.includes(searchLower) ||
        doc.email?.toLowerCase().includes(searchLower)
      );
    }

    // Sort by created_at (most recent first)
    patients.sort((a, b) => (b.created_at?.toDate?.() || 0) - (a.created_at?.toDate?.() || 0));

    const total = patients.length;
    const startIndex = (page - 1) * limit;
    const paginatedPatients = patients.slice(startIndex, startIndex + limit);

    return {
      patients: paginatedPatients,
      meta: { 
        page: parseInt(page), 
        limit: parseInt(limit), 
        total, 
        pages: Math.ceil(total / limit) 
      },
    };
  }

  async getById(id) {
    const doc = await db.collection('patients').doc(id).get();
    if (!doc.exists || doc.data().deleted_at) {
      throw ApiError.notFound('Patient not found.');
    }

    const patient = { id: doc.id, ...doc.data() };

    // Get recent appointments
    const appointmentsSnapshot = await db.collection('appointments')
      .where('patient_id', '==', id)
      .where('deleted_at', '==', null)
      .orderBy('appointment_date', 'desc')
      .limit(10)
      .get();
    
    patient.recent_appointments = appointmentsSnapshot.docs.map(d => ({ id: d.id, ...d.data() }));

    // Get medical records count
    const recordsSnapshot = await db.collection('medical_records')
      .where('patient_id', '==', id)
      .where('deleted_at', '==', null)
      .get();

    patient.medical_records_count = recordsSnapshot.size;
    
    return patient;
  }

  async create(data) {
    const patientRef = db.collection('patients').doc();
    const patientPayload = {
      ...data,
      created_at: new Date(),
      updated_at: new Date(),
      deleted_at: null
    };

    await patientRef.set(patientPayload);
    return { id: patientRef.id, ...patientPayload };
  }

  async update(id, data) {
    const patientRef = db.collection('patients').doc(id);
    const doc = await patientRef.get();
    
    if (!doc.exists || doc.data().deleted_at) {
      throw ApiError.notFound('Patient not found.');
    }

    const updateData = { ...data, updated_at: new Date() };
    await patientRef.update(updateData);
    
    return { id, ...doc.data(), ...updateData };
  }

  async softDelete(id) {
    const patientRef = db.collection('patients').doc(id);
    const doc = await patientRef.get();

    if (!doc.exists || doc.data().deleted_at) {
      throw ApiError.notFound('Patient not found.');
    }

    await patientRef.update({ deleted_at: new Date() });
    return { message: 'Patient deleted successfully.' };
  }
}

module.exports = new PatientService();

