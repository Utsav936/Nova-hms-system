const { db } = require('../config/firebase');
const ApiError = require('../utils/ApiError');

class DepartmentService {
  async getAll() {
    const snapshot = await db.collection('departments').where('deleted_at', '==', null).orderBy('name', 'asc').get();
    const departments = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

    // Get doctor count per department
    const doctorsSnapshot = await db.collection('doctors').where('deleted_at', '==', null).get();
    const countMap = {};
    doctorsSnapshot.docs.forEach(doc => {
      const deptId = doc.data().department_id;
      countMap[deptId] = (countMap[deptId] || 0) + 1;
    });

    return departments.map(d => ({
      ...d,
      doctor_count: countMap[d.id] || 0,
    }));
  }

  async getById(id) {
    const doc = await db.collection('departments').doc(id).get();
    if (!doc.exists || doc.data().deleted_at) {
      throw ApiError.notFound('Department not found.');
    }

    const doctorsSnapshot = await db.collection('doctors')
      .where('department_id', '==', id)
      .where('deleted_at', '==', null)
      .get();

    const doctors = doctorsSnapshot.docs.map(d => ({ id: d.id, ...d.data() }));

    return { id: doc.id, ...doc.data(), doctors };
  }

  async create(data) {
    const deptRef = db.collection('departments').doc();
    const payload = {
      ...data,
      is_active: true,
      created_at: new Date(),
      updated_at: new Date(),
      deleted_at: null
    };
    await deptRef.set(payload);
    return { id: deptRef.id, ...payload };
  }

  async update(id, data) {
    const deptRef = db.collection('departments').doc(id);
    const doc = await deptRef.get();
    if (!doc.exists || doc.data().deleted_at) {
      throw ApiError.notFound('Department not found.');
    }

    const updateData = { ...data, updated_at: new Date() };
    await deptRef.update(updateData);
    return { id, ...doc.data(), ...updateData };
  }

  async softDelete(id) {
    const deptRef = db.collection('departments').doc(id);
    const doc = await deptRef.get();
    if (!doc.exists || doc.data().deleted_at) {
      throw ApiError.notFound('Department not found.');
    }

    const doctorCountSnapshot = await db.collection('doctors')
      .where('department_id', '==', id)
      .where('deleted_at', '==', null)
      .get();

    if (doctorCountSnapshot.size > 0) {
      throw ApiError.badRequest('Cannot delete department with active doctors.');
    }

    await deptRef.update({ deleted_at: new Date(), is_active: false });
    return { message: 'Department deleted successfully.' };
  }
}

module.exports = new DepartmentService();

