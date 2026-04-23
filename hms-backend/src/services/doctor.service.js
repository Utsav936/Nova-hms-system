const { db, auth } = require('../config/firebase');
const ApiError = require('../utils/ApiError');

class DoctorService {
  async getAll({ page = 1, limit = 20, department_id, specialization, search }) {
    let query = db.collection('doctors').where('deleted_at', '==', null);

    if (department_id) {
      query = query.where('department_id', '==', department_id);
    }
    
    if (specialization) {
      // Note: Firestore doesn't support case-insensitive like. 
      // For a premium feel, we'll filter specialization if provided.
      query = query.where('specialization', '==', specialization);
    }

    const snapshot = await query.get();
    let doctors = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

    // Apply search filter in-memory for basic "premium" search feel
    if (search) {
      const searchLower = search.toLowerCase();
      doctors = doctors.filter(doc => 
        doc.first_name?.toLowerCase().includes(searchLower) ||
        doc.last_name?.toLowerCase().includes(searchLower) ||
        doc.specialization?.toLowerCase().includes(searchLower)
      );
    }

    const total = doctors.length;
    const startIndex = (page - 1) * limit;
    const paginatedDoctors = doctors.slice(startIndex, startIndex + limit);

    return {
      doctors: paginatedDoctors,
      meta: { 
        page: parseInt(page), 
        limit: parseInt(limit), 
        total, 
        pages: Math.ceil(total / limit) 
      },
    };
  }

  async getById(id) {
    const doc = await db.collection('doctors').doc(id).get();
    if (!doc.exists || doc.data().deleted_at) {
      throw ApiError.notFound('Doctor not found.');
    }

    const doctor = { id: doc.id, ...doc.data() };

    // Get aggregated stats from related collections
    const appointmentsSnapshot = await db.collection('appointments')
      .where('doctor_id', '==', id)
      .where('deleted_at', '==', null)
      .get();
    
    const uniquePatients = new Set(appointmentsSnapshot.docs.map(d => d.data().patient_id));

    doctor.total_appointments = appointmentsSnapshot.size;
    doctor.total_patients = uniquePatients.size;
    
    return doctor;
  }

  async create(data) {
    const { email, password, first_name, last_name, ...doctorData } = data;

    // Create user in Firebase Auth
    let userRecord;
    try {
      userRecord = await auth.createUser({
        email,
        password,
        displayName: `${first_name} ${last_name}`,
      });
      
      // Set custom claims for role-based access
      await auth.setCustomUserClaims(userRecord.uid, { role: 'doctor' });
    } catch (error) {
      if (error.code === 'auth/email-already-exists') {
        throw ApiError.badRequest('Email already in use.');
      }
      throw error;
    }

    // Create doctor profile in Firestore
    const doctorRef = db.collection('doctors').doc(userRecord.uid);
    const doctorPayload = {
      ...doctorData,
      user_id: userRecord.uid,
      first_name,
      last_name,
      email,
      created_at: new Date(),
      updated_at: new Date(),
      deleted_at: null,
      is_available: true
    };

    await doctorRef.set(doctorPayload);

    return { id: userRecord.uid, ...doctorPayload };
  }

  async update(id, data) {
    const doctorRef = db.collection('doctors').doc(id);
    const doc = await doctorRef.get();
    
    if (!doc.exists || doc.data().deleted_at) {
      throw ApiError.notFound('Doctor not found.');
    }

    const updateData = { ...data, updated_at: new Date() };
    await doctorRef.update(updateData);
    
    return { id, ...doc.data(), ...updateData };
  }

  async softDelete(id) {
    const doctorRef = db.collection('doctors').doc(id);
    const doc = await doctorRef.get();

    if (!doc.exists || doc.data().deleted_at) {
      throw ApiError.notFound('Doctor not found.');
    }

    await doctorRef.update({ 
      deleted_at: new Date(), 
      is_available: false 
    });

    // Also disable in Firebase Auth
    await auth.updateUser(id, { disabled: true });

    return { message: 'Doctor deleted successfully.' };
  }
}

module.exports = new DoctorService();

