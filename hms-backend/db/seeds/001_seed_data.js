const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');

/**
 * @param { import("knex").Knex } knex
 */
exports.seed = async function (knex) {
  // ── Clean existing data (in reverse FK order) ──
  await knex.raw('TRUNCATE staff, prescriptions, medical_records, appointments, patients, doctors, departments, refresh_tokens, users CASCADE');

  const hash = await bcrypt.hash('Password123!', 12);

  // ── Users ──
  const adminId = uuidv4();
  const doctor1Id = uuidv4();
  const doctor2Id = uuidv4();
  const doctor3Id = uuidv4();
  const doctor4Id = uuidv4();
  const doctor5Id = uuidv4();
  const recep1Id = uuidv4();
  const patient1UserId = uuidv4();
  const patient2UserId = uuidv4();
  const patient3UserId = uuidv4();

  await knex('users').insert([
    { id: adminId,        email: 'admin@novahms.com',        phone: '1111111111', password_hash: hash, role: 'admin',        first_name: 'System',   last_name: 'Admin' },
    { id: doctor1Id,      email: 'dr.sharma@novahms.com',    phone: '2222222221', password_hash: hash, role: 'doctor',       first_name: 'Rajesh',   last_name: 'Sharma' },
    { id: doctor2Id,      email: 'dr.patel@novahms.com',     phone: '2222222222', password_hash: hash, role: 'doctor',       first_name: 'Priya',    last_name: 'Patel' },
    { id: doctor3Id,      email: 'dr.kumar@novahms.com',     phone: '2222222223', password_hash: hash, role: 'doctor',       first_name: 'Amit',     last_name: 'Kumar' },
    { id: doctor4Id,      email: 'dr.reddy@novahms.com',     phone: '2222222224', password_hash: hash, role: 'doctor',       first_name: 'Sneha',    last_name: 'Reddy' },
    { id: doctor5Id,      email: 'dr.singh@novahms.com',     phone: '2222222225', password_hash: hash, role: 'doctor',       first_name: 'Arjun',    last_name: 'Singh' },
    { id: recep1Id,       email: 'reception@novahms.com',    phone: '3333333333', password_hash: hash, role: 'receptionist', first_name: 'Neha',     last_name: 'Gupta' },
    { id: patient1UserId, email: 'patient1@novahms.com',     phone: '9812345671', password_hash: hash, role: 'patient',      first_name: 'Vikram',   last_name: 'Mehta' },
    { id: patient2UserId, email: 'patient2@novahms.com',     phone: '9812345672', password_hash: hash, role: 'patient',      first_name: 'Ananya',   last_name: 'Joshi' },
    { id: patient3UserId, email: 'patient3@novahms.com',     phone: '9812345673', password_hash: hash, role: 'patient',      first_name: 'Rohan',    last_name: 'Kapoor' },
  ]);

  // ── Departments ──
  const deptCardio = uuidv4();
  const deptNeuro = uuidv4();
  const deptOrtho = uuidv4();
  const deptPediatrics = uuidv4();
  const deptGeneral = uuidv4();

  await knex('departments').insert([
    { id: deptCardio,     name: 'Cardiology',        description: 'Heart and cardiovascular system care' },
    { id: deptNeuro,      name: 'Neurology',         description: 'Brain, spinal cord, and nervous system care' },
    { id: deptOrtho,      name: 'Orthopedics',       description: 'Bones, joints, and musculoskeletal system care' },
    { id: deptPediatrics, name: 'Pediatrics',        description: 'Medical care for infants, children, and adolescents' },
    { id: deptGeneral,    name: 'General Medicine',  description: 'Primary healthcare and general medical treatment' },
  ]);

  // ── Doctors ──
  const docProfile1 = uuidv4();
  const docProfile2 = uuidv4();
  const docProfile3 = uuidv4();
  const docProfile4 = uuidv4();
  const docProfile5 = uuidv4();

  await knex('doctors').insert([
    { id: docProfile1, user_id: doctor1Id, department_id: deptCardio,     specialization: 'Interventional Cardiology', phone: '9876543210', qualification: 'MBBS, MD (Cardiology), DM',  experience_years: 15, consultation_fee: 1500.00, bio: 'Senior cardiologist with expertise in angioplasty and cardiac catheterization.' },
    { id: docProfile2, user_id: doctor2Id, department_id: deptNeuro,      specialization: 'Clinical Neurology',        phone: '9876543211', qualification: 'MBBS, MD (Neurology)',       experience_years: 12, consultation_fee: 1200.00, bio: 'Specializes in epilepsy, stroke, and neurodegenerative disorders.' },
    { id: docProfile3, user_id: doctor3Id, department_id: deptOrtho,      specialization: 'Joint Replacement Surgery', phone: '9876543212', qualification: 'MBBS, MS (Ortho), DNB',      experience_years: 10, consultation_fee: 1000.00, bio: 'Expert in knee and hip replacement surgeries.' },
    { id: docProfile4, user_id: doctor4Id, department_id: deptPediatrics, specialization: 'Neonatology',               phone: '9876543213', qualification: 'MBBS, MD (Pediatrics), DM',  experience_years: 8,  consultation_fee: 800.00,  bio: 'Focuses on newborn care and pediatric intensive care.' },
    { id: docProfile5, user_id: doctor5Id, department_id: deptGeneral,    specialization: 'Internal Medicine',         phone: '9876543214', qualification: 'MBBS, MD (Medicine)',         experience_years: 20, consultation_fee: 500.00,  bio: 'Veteran physician providing comprehensive primary healthcare.' },
  ]);

  // ── Patients ──
  const pat1 = uuidv4();
  const pat2 = uuidv4();
  const pat3 = uuidv4();
  const pat4 = uuidv4();
  const pat5 = uuidv4();
  const pat6 = uuidv4();
  const pat7 = uuidv4();
  const pat8 = uuidv4();

  await knex('patients').insert([
    { id: pat1, user_id: patient1UserId, first_name: 'Vikram',   last_name: 'Mehta',      date_of_birth: '1985-03-15', gender: 'male',   blood_group: 'O+',  phone: '9812345671', email: 'patient1@novahms.com',    address: '45 MG Road, Bangalore',         emergency_contact_name: 'Sita Mehta',     emergency_contact_phone: '9812345600' },
    { id: pat2, user_id: patient2UserId, first_name: 'Ananya',   last_name: 'Joshi',      date_of_birth: '1992-07-22', gender: 'female', blood_group: 'A+',  phone: '9812345672', email: 'patient2@novahms.com',    address: '12 Park Street, Kolkata',        emergency_contact_name: 'Ravi Joshi',     emergency_contact_phone: '9812345601' },
    { id: pat3, user_id: patient3UserId, first_name: 'Rohan',    last_name: 'Kapoor',     date_of_birth: '1978-11-05', gender: 'male',   blood_group: 'B+',  phone: '9812345673', email: 'patient3@novahms.com',    address: '88 Ring Road, Delhi',            emergency_contact_name: 'Meena Kapoor',   emergency_contact_phone: '9812345602' },
    { id: pat4, user_id: null,           first_name: 'Divya',    last_name: 'Nair',       date_of_birth: '1990-01-18', gender: 'female', blood_group: 'AB+', phone: '9812345674', email: 'divya.nair@email.com',    address: '5 Marine Drive, Mumbai',         emergency_contact_name: 'Suresh Nair',    emergency_contact_phone: '9812345603' },
    { id: pat5, user_id: null,           first_name: 'Karan',    last_name: 'Deshmukh',   date_of_birth: '2001-05-30', gender: 'male',   blood_group: 'O-',  phone: '9812345675', email: 'karan.d@email.com',       address: '23 FC Road, Pune',               emergency_contact_name: 'Anjali Deshmukh',emergency_contact_phone: '9812345604' },
    { id: pat6, user_id: null,           first_name: 'Pooja',    last_name: 'Verma',      date_of_birth: '1965-09-12', gender: 'female', blood_group: 'A-',  phone: '9812345676', email: 'pooja.v@email.com',       address: '67 Civil Lines, Jaipur',         emergency_contact_name: 'Rahul Verma',    emergency_contact_phone: '9812345605' },
    { id: pat7, user_id: null,           first_name: 'Suraj',    last_name: 'Yadav',      date_of_birth: '1995-12-01', gender: 'male',   blood_group: 'B-',  phone: '9812345677', email: 'suraj.y@email.com',       address: '34 Ashok Nagar, Hyderabad',      emergency_contact_name: 'Priya Yadav',    emergency_contact_phone: '9812345606' },
    { id: pat8, user_id: null,           first_name: 'Meera',    last_name: 'Iyer',       date_of_birth: '2010-04-25', gender: 'female', blood_group: 'AB-', phone: '9812345678', email: 'meera.parent@email.com',  address: '9 Anna Nagar, Chennai',          emergency_contact_name: 'Lakshmi Iyer',   emergency_contact_phone: '9812345607' },
  ]);

  // ── Appointments ──
  const today = new Date();
  const formatDate = (d) => d.toISOString().split('T')[0];

  const daysAgo = (n) => { const d = new Date(today); d.setDate(d.getDate() - n); return formatDate(d); };
  const daysFromNow = (n) => { const d = new Date(today); d.setDate(d.getDate() + n); return formatDate(d); };

  const appt1 = uuidv4();
  const appt2 = uuidv4();
  const appt3 = uuidv4();

  await knex('appointments').insert([
    // Past — completed
    { id: appt1, patient_id: pat1, doctor_id: docProfile1, appointment_date: daysAgo(10), appointment_time: '09:00', status: 'completed',  type: 'consultation',    reason: 'Chest pain and shortness of breath' },
    { id: appt2, patient_id: pat2, doctor_id: docProfile2, appointment_date: daysAgo(7),  appointment_time: '10:30', status: 'completed',  type: 'consultation',    reason: 'Recurring headaches and dizziness' },
    { id: appt3, patient_id: pat3, doctor_id: docProfile3, appointment_date: daysAgo(5),  appointment_time: '11:00', status: 'completed',  type: 'follow_up',       reason: 'Follow-up for knee pain' },
    { patient_id: pat4, doctor_id: docProfile5, appointment_date: daysAgo(3),  appointment_time: '14:00', status: 'completed',  type: 'routine_checkup', reason: 'Annual health check-up' },
    { patient_id: pat5, doctor_id: docProfile1, appointment_date: daysAgo(2),  appointment_time: '15:30', status: 'no_show',    type: 'consultation',    reason: 'Heart palpitations' },
    // Today
    { patient_id: pat6, doctor_id: docProfile5, appointment_date: formatDate(today), appointment_time: '09:30', status: 'confirmed',  type: 'consultation',    reason: 'General weakness and fatigue' },
    { patient_id: pat7, doctor_id: docProfile4, appointment_date: formatDate(today), appointment_time: '10:00', status: 'scheduled',  type: 'consultation',    reason: 'Child vaccination' },
    { patient_id: pat1, doctor_id: docProfile1, appointment_date: formatDate(today), appointment_time: '11:30', status: 'in_progress', type: 'follow_up',       reason: 'Follow-up heart checkup' },
    // Future
    { patient_id: pat2, doctor_id: docProfile2, appointment_date: daysFromNow(1), appointment_time: '09:00', status: 'scheduled', type: 'follow_up',       reason: 'Neurology follow-up' },
    { patient_id: pat3, doctor_id: docProfile3, appointment_date: daysFromNow(2), appointment_time: '10:00', status: 'scheduled', type: 'consultation',    reason: 'Knee replacement consultation' },
    { patient_id: pat8, doctor_id: docProfile4, appointment_date: daysFromNow(3), appointment_time: '11:00', status: 'scheduled', type: 'routine_checkup', reason: 'Pediatric routine checkup' },
    { patient_id: pat4, doctor_id: docProfile1, appointment_date: daysFromNow(5), appointment_time: '14:00', status: 'scheduled', type: 'consultation',    reason: 'ECG and cardiac evaluation' },
    { patient_id: pat5, doctor_id: docProfile2, appointment_date: daysFromNow(7), appointment_time: '15:00', status: 'scheduled', type: 'consultation',    reason: 'Suspected migraine evaluation' },
  ]);

  // ── Medical Records ──
  const rec1 = uuidv4();
  const rec2 = uuidv4();
  const rec3 = uuidv4();

  await knex('medical_records').insert([
    { id: rec1, patient_id: pat1, doctor_id: docProfile1, appointment_id: appt1, diagnosis: 'Stable Angina',               symptoms: 'Chest pain during exertion, shortness of breath', treatment: 'Prescribed beta-blockers and nitroglycerin',                    notes: 'Patient advised to reduce physical stress. Follow-up in 2 weeks.',          record_date: daysAgo(10) + ' 09:30:00' },
    { id: rec2, patient_id: pat2, doctor_id: docProfile2, appointment_id: appt2, diagnosis: 'Tension-type Headache',       symptoms: 'Bilateral headache, neck stiffness, mild dizziness',  treatment: 'Prescribed analgesics and muscle relaxants',                   notes: 'MRI scan ordered to rule out structural abnormalities.',                    record_date: daysAgo(7) + ' 11:00:00' },
    { id: rec3, patient_id: pat3, doctor_id: docProfile3, appointment_id: appt3, diagnosis: 'Osteoarthritis — Right Knee', symptoms: 'Pain, swelling, reduced mobility in right knee',      treatment: 'Physiotherapy recommended, prescribed anti-inflammatory drugs', notes: 'If condition does not improve in 4 weeks, consider joint replacement.',     record_date: daysAgo(5) + ' 11:30:00' },
  ]);

  // ── Prescriptions ──
  await knex('prescriptions').insert([
    { medical_record_id: rec1, medication_name: 'Metoprolol',       dosage: '50mg',  frequency: 'Once daily',    duration: '30 days', instructions: 'Take in the morning with food' },
    { medical_record_id: rec1, medication_name: 'Nitroglycerin',    dosage: '0.4mg', frequency: 'As needed',     duration: 'PRN',     instructions: 'Place under tongue during chest pain episodes' },
    { medical_record_id: rec2, medication_name: 'Ibuprofen',        dosage: '400mg', frequency: 'Twice daily',   duration: '7 days',  instructions: 'Take after meals' },
    { medical_record_id: rec2, medication_name: 'Tizanidine',       dosage: '2mg',   frequency: 'At bedtime',    duration: '14 days', instructions: 'May cause drowsiness, do not drive' },
    { medical_record_id: rec3, medication_name: 'Diclofenac Gel',   dosage: '1%',    frequency: 'Three times daily', duration: '21 days', instructions: 'Apply on affected area, avoid covering' },
    { medical_record_id: rec3, medication_name: 'Glucosamine',      dosage: '1500mg', frequency: 'Once daily',   duration: '90 days', instructions: 'Dietary supplement for joint health' },
  ]);

  // ── Staff ──
  await knex('staff').insert([
    { id: uuidv4(), user_id: adminId, first_name: 'System', last_name: 'Admin', role_title: 'Hospital Administrator', contact_number: '1111111111', email: 'admin@novahms.com', description: 'Oversees all hospital operations', shift_timing: '09:00 - 17:00', department_id: null },
    { id: uuidv4(), user_id: null, first_name: 'Ramesh', last_name: 'Bhai', role_title: 'Cleaning Staff', contact_number: '9998887771', email: null, description: 'General ward maintenance and cleaning', shift_timing: '06:00 - 14:00', department_id: deptGeneral },
    { id: uuidv4(), user_id: null, first_name: 'Suresh', last_name: 'Kumar', role_title: 'Security Officer', contact_number: '9998887772', email: null, description: 'Main gate security and patient routing', shift_timing: '18:00 - 06:00', department_id: null },
    { id: uuidv4(), user_id: recep1Id, first_name: 'Neha', last_name: 'Gupta', role_title: 'Head Receptionist', contact_number: '3333333333', email: 'reception@novahms.com', description: 'Front desk operations and appointments coordinator', shift_timing: '08:00 - 16:00', department_id: null }
  ]);

  console.log('✅ Seed data inserted successfully');
};
