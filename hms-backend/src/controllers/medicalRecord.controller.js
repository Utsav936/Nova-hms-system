const catchAsync = require('../utils/catchAsync');
const medicalRecordService = require('../services/medicalRecord.service');

const getAll = catchAsync(async (req, res) => {
  const result = await medicalRecordService.getAll({ ...req.query, user: req.user });
  res.json({ status: 'success', data: result.records, meta: result.meta });
});

const getById = catchAsync(async (req, res) => {
  const record = await medicalRecordService.getById(req.params.id);
  res.json({ status: 'success', data: { record } });
});

const getByPatientId = catchAsync(async (req, res) => {
  const records = await medicalRecordService.getByPatientId(req.params.patientId);
  res.json({ status: 'success', data: records });
});

const create = catchAsync(async (req, res) => {
  const record = await medicalRecordService.create(req.body, req.user.id);
  res.status(201).json({ status: 'success', data: { record } });
});

const update = catchAsync(async (req, res) => {
  const record = await medicalRecordService.update(req.params.id, req.body, req.user.id);
  res.json({ status: 'success', data: { record } });
});

module.exports = { getAll, getById, getByPatientId, create, update };
