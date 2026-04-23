const catchAsync = require('../utils/catchAsync');
const patientService = require('../services/patient.service');

const getAll = catchAsync(async (req, res) => {
  const result = await patientService.getAll(req.query);
  res.json({ status: 'success', data: result.patients, meta: result.meta });
});

const getById = catchAsync(async (req, res) => {
  const patient = await patientService.getById(req.params.id);
  res.json({ status: 'success', data: { patient } });
});

const create = catchAsync(async (req, res) => {
  const patient = await patientService.create(req.body);
  res.status(201).json({ status: 'success', data: { patient } });
});

const update = catchAsync(async (req, res) => {
  const patient = await patientService.update(req.params.id, req.body);
  res.json({ status: 'success', data: { patient } });
});

const remove = catchAsync(async (req, res) => {
  const result = await patientService.softDelete(req.params.id);
  res.json({ status: 'success', ...result });
});

module.exports = { getAll, getById, create, update, remove };
