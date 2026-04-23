const { db } = require('../config/firebase');
const ApiError = require('../utils/ApiError');

class StaffService {
  async getAll({ search }) {
    const snapshot = await db.collection('staff').where('deleted_at', '==', null).orderBy('first_name', 'asc').get();
    let records = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

    if (search) {
      const searchLower = search.toLowerCase();
      records = records.filter(doc => 
        doc.first_name?.toLowerCase().includes(searchLower) ||
        doc.last_name?.toLowerCase().includes(searchLower) ||
        doc.role_title?.toLowerCase().includes(searchLower)
      );
    }

    return records;
  }

  async getById(id) {
    const doc = await db.collection('staff').doc(id).get();
    if (!doc.exists || doc.data().deleted_at) {
      throw ApiError.notFound('Staff record not found');
    }
    return { id: doc.id, ...doc.data() };
  }

  async create(data) {
    const staffRef = db.collection('staff').doc();
    const payload = {
      ...data,
      created_at: new Date(),
      updated_at: new Date(),
      deleted_at: null
    };
    await staffRef.set(payload);
    return { id: staffRef.id, ...payload };
  }

  async update(id, data) {
    const staffRef = db.collection('staff').doc(id);
    const doc = await staffRef.get();
    if (!doc.exists || doc.data().deleted_at) {
      throw ApiError.notFound('Staff record not found');
    }

    const updateData = { ...data, updated_at: new Date() };
    await staffRef.update(updateData);
    return { id, ...doc.data(), ...updateData };
  }

  async delete(id) {
    const staffRef = db.collection('staff').doc(id);
    const doc = await staffRef.get();
    if (!doc.exists || doc.data().deleted_at) {
      throw ApiError.notFound('Staff record not found');
    }

    await staffRef.update({ deleted_at: new Date() });
  }
}

module.exports = new StaffService();

