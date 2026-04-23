const catchAsync = require('../utils/catchAsync');
const doctorService = require('../services/doctor.service');

const getAll = catchAsync(async (req, res) => {
  const result = await doctorService.getAll(req.query);
  res.json({ status: 'success', data: result.doctors, meta: result.meta });
});

const getById = catchAsync(async (req, res) => {
  const doctor = await doctorService.getById(req.params.id);
  res.json({ status: 'success', data: { doctor } });
});

const create = catchAsync(async (req, res) => {
  const doctor = await doctorService.create(req.body);
  res.status(201).json({ status: 'success', data: { doctor } });
});

const update = catchAsync(async (req, res) => {
  const doctor = await doctorService.update(req.params.id, req.body);
  res.json({ status: 'success', data: { doctor } });
});

const remove = catchAsync(async (req, res) => {
  const result = await doctorService.softDelete(req.params.id);
  res.json({ status: 'success', ...result });
});

module.exports = { getAll, getById, create, update, remove };
