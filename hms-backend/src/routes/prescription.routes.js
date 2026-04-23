const express = require('express');
const router = express.Router();
const prescriptionController = require('../controllers/prescription.controller');
const authenticate = require('../middleware/authenticate');

router.use(authenticate); // All prescription routes require authentication

router.get('/', prescriptionController.getAllPrescriptions);
router.get('/:id', prescriptionController.getPrescription);
router.post('/', prescriptionController.createPrescription);
router.patch('/:id/status', prescriptionController.updateStatus);

module.exports = router;
