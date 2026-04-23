const { db } = require('../config/firebase');
const ApiError = require('../utils/ApiError');

class UserService {
  async getAll({ page = 1, limit = 20, role, search }) {
    let query = db.collection('users').where('deleted_at', '==', null);

    if (role) query = query.where('role', '==', role);

    const snapshot = await query.get();
    let users = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

    if (search) {
      const searchLower = search.toLowerCase();
      users = users.filter(doc => 
        doc.first_name?.toLowerCase().includes(searchLower) ||
        doc.last_name?.toLowerCase().includes(searchLower) ||
        doc.email?.toLowerCase().includes(searchLower)
      );
    }

    // Sort by created_at (desc)
    users.sort((a, b) => (b.created_at?.toDate?.() || 0) - (a.created_at?.toDate?.() || 0));

    const total = users.length;
    const startIndex = (page - 1) * limit;
    const paginated = users.slice(startIndex, startIndex + limit);

    return {
      users: paginated,
      meta: { 
        page: parseInt(page), 
        limit: parseInt(limit), 
        total, 
        pages: Math.ceil(total / limit) 
      },
    };
  }

  async getById(id) {
    const doc = await db.collection('users').doc(id).get();
    if (!doc.exists || doc.data().deleted_at) {
      throw ApiError.notFound('User not found.');
    }
    return { id: doc.id, ...doc.data() };
  }

  async update(id, data) {
    const userRef = db.collection('users').doc(id);
    const doc = await userRef.get();
    if (!doc.exists || doc.data().deleted_at) {
      throw ApiError.notFound('User not found.');
    }

    const updateData = { ...data, updated_at: new Date() };
    await userRef.update(updateData);
    
    return { id, ...doc.data(), ...updateData };
  }

  async softDelete(id) {
    const userRef = db.collection('users').doc(id);
    const doc = await userRef.get();
    
    if (!doc.exists || doc.data().deleted_at) {
      throw ApiError.notFound('User not found.');
    }
    
    if (doc.data().role === 'admin') {
      throw ApiError.badRequest('Cannot delete admin users.');
    }

    await userRef.update({ deleted_at: new Date(), is_active: false });
    return { message: 'User deleted successfully.' };
  }
}

module.exports = new UserService();

