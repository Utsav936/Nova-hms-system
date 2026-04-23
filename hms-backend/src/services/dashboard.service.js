const { db } = require('../config/firebase');

class DashboardService {
  /**
   * Admin dashboard stats
   */
  async getAdminStats() {
    const today = new Date().toISOString().split('T')[0];

    // Fetch all counts in parallel for premium speed
    const [
      patientsSnap,
      doctorsSnap,
      appointmentsSnap,
      departmentsSnap
    ] = await Promise.all([
      db.collection('patients').where('deleted_at', '==', null).get(),
      db.collection('doctors').where('deleted_at', '==', null).get(),
      db.collection('appointments').where('deleted_at', '==', null).get(),
      db.collection('departments').where('deleted_at', '==', null).get(),
    ]);

    const allAppointments = appointmentsSnap.docs.map(doc => doc.data());
    const todayAppointmentsCount = allAppointments.filter(a => a.appointment_date === today).length;
    const completedAppointmentsCount = allAppointments.filter(a => a.status === 'completed').length;

    // Status breakdown aggregation
    const statusMap = {};
    allAppointments.forEach(a => {
      statusMap[a.status] = (statusMap[a.status] || 0) + 1;
    });

    const status_breakdown = Object.entries(statusMap).map(([status, count]) => ({ status, count }));

    // Weekly trend (last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const sevenDaysAgoStr = sevenDaysAgo.toISOString().split('T')[0];

    const weeklyMap = {};
    allAppointments.forEach(a => {
      if (a.appointment_date >= sevenDaysAgoStr && a.appointment_date <= today) {
        weeklyMap[a.appointment_date] = (weeklyMap[a.appointment_date] || 0) + 1;
      }
    });

    const weekly_trend = Object.entries(weeklyMap)
      .map(([date, count]) => ({ date, count }))
      .sort((a, b) => a.date.localeCompare(b.date));

    // Recent appointments (sorted by created_at desc)
    const recent_appointments = appointmentsSnap.docs
      .map(doc => ({ id: doc.id, ...doc.data() }))
      .sort((a, b) => (b.created_at?.toDate?.() || 0) - (a.created_at?.toDate?.() || 0))
      .slice(0, 10);

    return {
      total_patients: patientsSnap.size,
      total_doctors: doctorsSnap.size,
      total_appointments: appointmentsSnap.size,
      total_departments: departmentsSnap.size,
      today_appointments: todayAppointmentsCount,
      completed_appointments: completedAppointmentsCount,
      status_breakdown,
      recent_appointments,
      weekly_trend
    };
  }

  /**
   * Doctor dashboard stats
   */
  async getDoctorStats(userId) {
    const today = new Date().toISOString().split('T')[0];
    
    const appointmentsSnap = await db.collection('appointments')
      .where('doctor_id', '==', userId)
      .where('deleted_at', '==', null)
      .get();

    const appointments = appointmentsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    const todaySchedule = appointments
      .filter(a => a.appointment_date === today)
      .sort((a, b) => a.appointment_time.localeCompare(b.appointment_time));

    const uniquePatients = new Set(appointments.map(a => a.patient_id));

    return {
      total_patients: uniquePatients.size,
      total_appointments: appointments.length,
      today_appointments: todaySchedule.length,
      today_schedule: todaySchedule,
    };
  }

  /**
   * Patient dashboard stats
   */
  async getPatientStats(userId) {
    const today = new Date().toISOString().split('T')[0];

    const [patientDoc, appointmentsSnap, recordsSnap] = await Promise.all([
      db.collection('patients').doc(userId).get(),
      db.collection('appointments').where('patient_id', '==', userId).where('deleted_at', '==', null).get(),
      db.collection('medical_records').where('patient_id', '==', userId).where('deleted_at', '==', null).get()
    ]);

    if (!patientDoc.exists) return {};

    const appointments = appointmentsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    const upcoming_appointments = appointments
      .filter(a => a.appointment_date >= today && !['cancelled', 'completed', 'no_show'].includes(a.status))
      .sort((a, b) => a.appointment_date.localeCompare(b.appointment_date))
      .slice(0, 5);

    return {
      patient_profile: { id: patientDoc.id, ...patientDoc.data() },
      total_appointments: appointments.length || 0,
      upcoming_appointments: upcoming_appointments || [],
      medical_records_count: recordsSnap.size || 0,
      // Provide defaults for shared dashboard components
      total_patients: 0,
      total_doctors: 0,
      today_appointments: upcoming_appointments.length || 0,
      total_departments: 0,
      recent_appointments: upcoming_appointments || []
    };
  }
}

module.exports = new DashboardService();

