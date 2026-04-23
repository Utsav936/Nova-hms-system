const catchAsync = require('../utils/catchAsync');
const prescriptionService = require('../services/prescription.service');

const getAllPrescriptions = catchAsync(async (req, res) => {
  const prescriptions = await prescriptionService.getAll({ 
    patient_id: req.query.patient_id,
    doctor_id: req.query.doctor_id,
    user: req.user 
  });
  res.status(200).json({
    status: 'success',
    data: prescriptions
  });
});

const getPrescription = catchAsync(async (req, res) => {
  const prescription = await prescriptionService.getById(req.params.id);
  res.status(200).json({
    status: 'success',
    data: prescription
  });
});

const createPrescription = catchAsync(async (req, res) => {
  const prescription = await prescriptionService.create(req.body, req.user.id);
  res.status(201).json({
    status: 'success',
    data: prescription
  });
});

const updateStatus = catchAsync(async (req, res) => {
  const prescription = await prescriptionService.updateStatus(req.params.id, req.body.status);
  res.status(200).json({
    status: 'success',
    data: prescription
  });
});

module.exports = {
  getAllPrescriptions,
  getPrescription,
  createPrescription,
  updateStatus
};
