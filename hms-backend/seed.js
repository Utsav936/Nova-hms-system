const { db, auth } = require('./src/config/firebase');

const seedData = async () => {
  console.log('🌱 Seeding Nova HMS Firestore & Auth...');

  const DEFAULT_PASSWORD = 'Password123';

  try {
    // 1. Seed Departments
    const depts = [
      { id: 'dept_cardio', name: 'Cardiology', description: 'Heart and vascular care', is_active: true },
      { id: 'dept_peds', name: 'Pediatrics', description: 'Children health care', is_active: true },
      { id: 'dept_neuro', name: 'Neurology', description: 'Brain and nervous system', is_active: true },
      { id: 'dept_ortho', name: 'Orthopedics', description: 'Bones and joints care', is_active: true },
      { id: 'dept_derm', name: 'Dermatology', description: 'Skin and aesthetic care', is_active: true }
    ];

    for (const dept of depts) {
      await db.collection('departments').doc(dept.id).set({
        ...dept,
        created_at: new Date(),
        updated_at: new Date(),
        deleted_at: null
      });
      console.log(`✅ Seeded Department: ${dept.name}`);
    }

    // 2. Define Users to Seed (Admin, Doctors, Receptionists)
    const usersToSeed = [
      {
        uid: 'admin_nova',
        email: 'admin@nova.com',
        first_name: 'Super',
        last_name: 'Admin',
        role: 'admin',
      },
      {
        uid: 'doc_smith',
        email: 'smith@nova.com',
        first_name: 'John',
        last_name: 'Smith',
        role: 'doctor',
        specialization: 'Senior Cardiologist',
        department_id: 'dept_cardio',
        qualification: 'MD, FACC',
        experience_years: 15,
        consultation_fee: 150,
      },
      {
        uid: 'doc_chen',
        email: 'chen@nova.com',
        first_name: 'Mei',
        last_name: 'Chen',
        role: 'doctor',
        specialization: 'Interventional Cardiologist',
        department_id: 'dept_cardio',
        qualification: 'MD, PhD',
        experience_years: 12,
        consultation_fee: 140,
      },
      {
        uid: 'doc_jones',
        email: 'jones@nova.com',
        first_name: 'Sarah',
        last_name: 'Jones',
        role: 'doctor',
        specialization: 'Pediatric Surgeon',
        department_id: 'dept_peds',
        qualification: 'MD, FAAP',
        experience_years: 10,
        consultation_fee: 100,
      },
      {
        uid: 'doc_patel',
        email: 'patel@nova.com',
        first_name: 'Raj',
        last_name: 'Patel',
        role: 'doctor',
        specialization: 'Neonatologist',
        department_id: 'dept_peds',
        qualification: 'MD, DCH',
        experience_years: 8,
        consultation_fee: 90,
      },
      {
        uid: 'doc_wilson',
        email: 'wilson@nova.com',
        first_name: 'Robert',
        last_name: 'Wilson',
        role: 'doctor',
        specialization: 'Neurosurgeon',
        department_id: 'dept_neuro',
        qualification: 'MD, FACS',
        experience_years: 20,
        consultation_fee: 250,
      },
      {
        uid: 'doc_garcia',
        email: 'garcia@nova.com',
        first_name: 'Elena',
        last_name: 'Garcia',
        role: 'doctor',
        specialization: 'Orthopedic Surgeon',
        department_id: 'dept_ortho',
        qualification: 'MD, FAAOS',
        experience_years: 14,
        consultation_fee: 180,
      },
      {
        uid: 'doc_lee',
        email: 'lee@nova.com',
        first_name: 'David',
        last_name: 'Lee',
        role: 'doctor',
        specialization: 'Consultant Dermatologist',
        department_id: 'dept_derm',
        qualification: 'MD, FAAD',
        experience_years: 11,
        consultation_fee: 120,
      },
      {
        uid: 'recep_clark',
        email: 'reception@nova.com',
        first_name: 'Alice',
        last_name: 'Clark',
        role: 'receptionist',
      }
    ];

    for (const userData of usersToSeed) {
      const { uid, email, role, ...profileData } = userData;

      // a. Create in Firebase Auth
      try {
        await auth.createUser({
          uid,
          email,
          password: DEFAULT_PASSWORD,
          displayName: `${profileData.first_name} ${profileData.last_name}`,
        });
        console.log(`👤 Auth Created: ${email}`);
      } catch (err) {
        if (err.code === 'auth/uid-already-exists' || err.code === 'auth/email-already-exists') {
          console.log(`ℹ️ User ${email} already exists in Auth, updating profile...`);
        } else {
          throw err;
        }
      }

      // b. Set Custom Claims (Roles)
      await auth.setCustomUserClaims(uid, { role });

      // c. Create Firestore User Profile
      const commonProfile = {
        id: uid,
        email,
        role,
        first_name: profileData.first_name,
        last_name: profileData.last_name,
        is_active: true,
        created_at: new Date(),
        updated_at: new Date(),
        deleted_at: null
      };

      await db.collection('users').doc(uid).set(commonProfile);

      // d. Create Role-Specific Profile
      if (role === 'doctor') {
        await db.collection('doctors').doc(uid).set({
          ...commonProfile,
          ...profileData,
          is_available: true
        });
      } else if (role === 'receptionist') {
        await db.collection('receptionists').doc(uid).set(commonProfile);
      }

      console.log(`✅ Profile Seeded: ${profileData.first_name} (${role})`);
    }

    console.log('\n🏁 Seeding completed successfully!');
    console.log('-----------------------------------');
    console.log(`Default Password for all: ${DEFAULT_PASSWORD}`);
    console.log('Admin       : admin@nova.com');
    console.log('Doctor      : smith@nova.com');
    console.log('Receptionist: reception@nova.com');
    console.log('-----------------------------------\n');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  }
};

seedData();
