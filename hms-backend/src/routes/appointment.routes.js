const express = require('express');
const router = express.Router();
const { getAll, getById, create, update, remove } = require('../controllers/appointment.controller');
const authenticate = require('../middleware/authenticate');
const authorize = require('../middleware/authorize');
const validate = require('../middleware/validate');
const { createAppointmentSchema, updateAppointmentSchema } = require('../validators/appointment.validator');

router.use(authenticate);

router.get('/', getAll);
router.get('/:id', getById);
router.post('/', authorize('admin', 'receptionist', 'patient'), validate(createAppointmentSchema), create);
router.patch('/:id', authorize('admin', 'doctor', 'receptionist'), validate(updateAppointmentSchema), update);
router.delete('/:id', authorize('admin'), remove);

module.exports = router;
