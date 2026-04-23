const catchAsync = require('../utils/catchAsync');
const labResultService = require('../services/labResult.service');

const getAllResults = catchAsync(async (req, res) => {
  const results = await labResultService.getAll({ 
    patient_id: req.query.patient_id,
    doctor_id: req.query.doctor_id,
    user: req.user 
  });
  res.status(200).json({
    status: 'success',
    data: results
  });
});

const getResult = catchAsync(async (req, res) => {
  const result = await labResultService.getById(req.params.id);
  res.status(200).json({
    status: 'success',
    data: result
  });
});

const createResult = catchAsync(async (req, res) => {
  const result = await labResultService.create(req.body, req.user.id);
  res.status(201).json({
    status: 'success',
    data: result
  });
});

module.exports = {
  getAllResults,
  getResult,
  createResult
};
