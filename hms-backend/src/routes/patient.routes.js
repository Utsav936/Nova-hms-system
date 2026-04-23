const express = require('express');
const router = express.Router();
const { getAll, getById, create, update, remove } = require('../controllers/patient.controller');
const authenticate = require('../middleware/authenticate');
const authorize = require('../middleware/authorize');
const validate = require('../middleware/validate');
const { createPatientSchema, updatePatientSchema } = require('../validators/patient.validator');

router.get('/', authenticate, authorize('admin', 'doctor', 'receptionist'), getAll);
router.get('/:id', authenticate, getById);
router.post('/', authenticate, authorize('admin', 'receptionist'), validate(createPatientSchema), create);
router.patch('/:id', authenticate, authorize('admin', 'receptionist', 'patient'), validate(updatePatientSchema), update);
router.delete('/:id', authenticate, authorize('admin'), remove);

module.exports = router;
