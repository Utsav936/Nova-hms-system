const { db } = require('../config/firebase');
const ApiError = require('../utils/ApiError');

class AppointmentService {
  async getAll({ page = 1, limit = 20, status, doctor_id, patient_id, date_from, date_to, user }) {
    let query = db.collection('appointments').where('deleted_at', '==', null);

    // Initial Role-based scoping (High-level filter)
    if (user.role === 'doctor') {
      query = query.where('doctor_id', '==', user.id);
    } else if (user.role === 'patient') {
      query = query.where('patient_id', '==', user.id);
    }

    const snapshot = await query.get();
    let appointments = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

    // In-memory filtering for complex queries (Avoids index requirements)
    if (status) appointments = appointments.filter(a => a.status === status);
    if (doctor_id) appointments = appointments.filter(a => a.doctor_id === doctor_id);
    if (patient_id) appointments = appointments.filter(a => a.patient_id === patient_id);
    if (date_from) appointments = appointments.filter(a => a.appointment_date >= date_from);
    if (date_to) appointments = appointments.filter(a => a.appointment_date <= date_to);

    // Sort by date (desc) and time (asc)
    appointments.sort((a, b) => {
      const dateA = a.appointment_date || '';
      const dateB = b.appointment_date || '';
      if (dateA !== dateB) return dateB.localeCompare(dateA);
      
      const timeA = a.appointment_time || '';
      const timeB = b.appointment_time || '';
      return timeA.localeCompare(timeB);
    });

    const total = appointments.length;
    const startIndex = (page - 1) * limit;
    const paginated = appointments.slice(startIndex, startIndex + limit);

    return {
      appointments: paginated,
      meta: { 
        page: parseInt(page), 
        limit: parseInt(limit), 
        total, 
        pages: Math.ceil(total / limit) 
      },
    };
  }

  async getById(id) {
    const doc = await db.collection('appointments').doc(id).get();
    if (!doc.exists || doc.data().deleted_at) {
      throw ApiError.notFound('Appointment not found.');
    }

    return { id: doc.id, ...doc.data() };
  }

  async create(data) {
    console.log('📅 Creating Appointment with data:', JSON.stringify(data, null, 2));
    const { doctor_id, patient_id, appointment_date, appointment_time } = data;

    // Verify doctor exists and is available
    const doctorDoc = await db.collection('doctors').doc(doctor_id).get();
    if (!doctorDoc.exists || doctorDoc.data().deleted_at) {
      throw ApiError.notFound('Doctor not found.');
    }
    if (!doctorDoc.data().is_available) {
      throw ApiError.badRequest('Doctor is not available.');
    }

    // Verify patient exists
    const patientDoc = await db.collection('patients').doc(patient_id).get();
    if (!patientDoc.exists || patientDoc.data().deleted_at) {
      throw ApiError.notFound('Patient not found.');
    }

    // Check for conflicting appointment
    const conflictSnapshot = await db.collection('appointments')
      .where('doctor_id', '==', doctor_id)
      .where('appointment_date', '==', appointment_date)
      .where('appointment_time', '==', appointment_time)
      .where('deleted_at', '==', null)
      .get();

    const conflicts = conflictSnapshot.docs.filter(d => !['cancelled', 'no_show'].includes(d.data().status));
    if (conflicts.length > 0) {
      throw ApiError.conflict('Doctor already has an appointment at this time.');
    }

    const appointmentRef = db.collection('appointments').doc();
    const appointmentPayload = {
      ...data,
      // Denormalize names for fast listing
      doctor_name: `${doctorDoc.data().first_name} ${doctorDoc.data().last_name}`,
      patient_name: `${patientDoc.data().first_name} ${patientDoc.data().last_name}`,
      specialization: doctorDoc.data().specialization,
      status: data.status || 'scheduled',
      created_at: new Date(),
      updated_at: new Date(),
      deleted_at: null
    };

    await appointmentRef.set(appointmentPayload);
    return { id: appointmentRef.id, ...appointmentPayload };
  }

  async update(id, data) {
    const appointmentRef = db.collection('appointments').doc(id);
    const doc = await appointmentRef.get();
    
    if (!doc.exists || doc.data().deleted_at) {
      throw ApiError.notFound('Appointment not found.');
    }

    const updateData = { ...data, updated_at: new Date() };
    await appointmentRef.update(updateData);
    
    return { id, ...doc.data(), ...updateData };
  }

  async softDelete(id) {
    const appointmentRef = db.collection('appointments').doc(id);
    const doc = await appointmentRef.get();

    if (!doc.exists || doc.data().deleted_at) {
      throw ApiError.notFound('Appointment not found.');
    }

    await appointmentRef.update({ 
      deleted_at: new Date(), 
      status: 'cancelled' 
    });
    
    return { message: 'Appointment cancelled successfully.' };
  }
}

module.exports = new AppointmentService();

