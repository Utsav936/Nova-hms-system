const catchAsync = require('../utils/catchAsync');
const appointmentService = require('../services/appointment.service');

const getAll = catchAsync(async (req, res) => {
  const result = await appointmentService.getAll({ ...req.query, user: req.user });
  res.json({ status: 'success', data: result.appointments, meta: result.meta });
});

const getById = catchAsync(async (req, res) => {
  const appointment = await appointmentService.getById(req.params.id);
  res.json({ status: 'success', data: { appointment } });
});

const create = catchAsync(async (req, res) => {
  console.log('🚀 [APPOINTMENT CREATE] Request Body:', JSON.stringify(req.body, null, 2));
  const appointment = await appointmentService.create(req.body);
  res.status(201).json({ status: 'success', data: { appointment } });
});

const update = catchAsync(async (req, res) => {
  const appointment = await appointmentService.update(req.params.id, req.body);
  res.json({ status: 'success', data: { appointment } });
});

const remove = catchAsync(async (req, res) => {
  const result = await appointmentService.softDelete(req.params.id);
  res.json({ status: 'success', ...result });
});

module.exports = { getAll, getById, create, update, remove };
