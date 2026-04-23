const express = require('express');
const router = express.Router();
const { getAll, getById, getByPatientId, create, update } = require('../controllers/medicalRecord.controller');
const authenticate = require('../middleware/authenticate');
const authorize = require('../middleware/authorize');
const validate = require('../middleware/validate');
const { createMedicalRecordSchema, updateMedicalRecordSchema } = require('../validators/general.validator');

router.use(authenticate);

router.get('/', getAll);
router.get('/:id', getById);
router.get('/patient/:patientId', authorize('admin', 'doctor'), getByPatientId);
router.post('/', authorize('doctor'), validate(createMedicalRecordSchema), create);
router.patch('/:id', authorize('doctor'), validate(updateMedicalRecordSchema), update);

module.exports = router;
