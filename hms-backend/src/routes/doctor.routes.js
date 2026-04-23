const express = require('express');
const router = express.Router();
const { getAll, getById, create, update, remove } = require('../controllers/doctor.controller');
const authenticate = require('../middleware/authenticate');
const authorize = require('../middleware/authorize');
const validate = require('../middleware/validate');
const { createDoctorSchema, updateDoctorSchema } = require('../validators/doctor.validator');

router.get('/', authenticate, getAll);
router.get('/:id', authenticate, getById);
router.post('/', authenticate, authorize('admin'), validate(createDoctorSchema), create);
router.patch('/:id', authenticate, authorize('admin', 'doctor'), validate(updateDoctorSchema), update);
router.delete('/:id', authenticate, authorize('admin'), remove);

module.exports = router;
