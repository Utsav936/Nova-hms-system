const catchAsync = require('../utils/catchAsync');
const departmentService = require('../services/department.service');

const getAll = catchAsync(async (req, res) => {
  const departments = await departmentService.getAll();
  res.json({ status: 'success', data: departments });
});

const getById = catchAsync(async (req, res) => {
  const department = await departmentService.getById(req.params.id);
  res.json({ status: 'success', data: { department } });
});

const create = catchAsync(async (req, res) => {
  const department = await departmentService.create(req.body);
  res.status(201).json({ status: 'success', data: { department } });
});

const update = catchAsync(async (req, res) => {
  const department = await departmentService.update(req.params.id, req.body);
  res.json({ status: 'success', data: { department } });
});

const remove = catchAsync(async (req, res) => {
  const result = await departmentService.softDelete(req.params.id);
  res.json({ status: 'success', ...result });
});

module.exports = { getAll, getById, create, update, remove };
