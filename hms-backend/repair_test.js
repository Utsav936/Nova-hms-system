const { db } = require('./src/config/firebase');
const appointmentService = require('./src/services/appointment.service');

async function testBooking() {
  console.log('🧪 Starting Surgical Bypass Test...');

  try {
    // 1. Find the user
    const userSnapshot = await db.collection('users').where('email', '==', 'utsavupadhyay95@gmail.com').get();
    if (userSnapshot.empty) {
      console.error('❌ User not found!');
      return;
    }
    const user = userSnapshot.docs[0].data();
    console.log('👤 User found:', user.id);

    // 2. Find their patient profile
    const patientDoc = await db.collection('patients').doc(user.id).get();
    if (!patientDoc.exists) {
      console.log('⚠️ Patient profile missing! Repairing now...');
      await db.collection('patients').doc(user.id).set({
        id: user.id,
        user_id: user.id,
        email: user.email,
        first_name: user.first_name || 'Utsav',
        last_name: user.last_name || 'Upadhyay',
        role: 'patient',
        is_active: true,
        created_at: new Date()
      });
      console.log('✅ Patient profile repaired.');
    }

    // 3. Attempt to book directly via service
    const testData = {
      patient_id: user.id,
      doctor_id: 'doc_smith',
      appointment_date: '2026-04-30',
      appointment_time: '10:00',
      type: 'consultation',
      reason: 'Surgical Bypass Test'
    };

    console.log('📅 Attempting to book appointment...');
    const appointment = await appointmentService.create(testData);
    console.log('🚀 SUCCESS! Appointment booked with ID:', appointment.id);

  } catch (err) {
    console.error('❌ Booking failed with error:', err.message);
    if (err.errors) console.error('Details:', JSON.stringify(err.errors, null, 2));
  } finally {
    process.exit(0);
  }
}

testBooking();
