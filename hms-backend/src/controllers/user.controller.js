const catchAsync = require('../utils/catchAsync');
const userService = require('../services/user.service');

const getAll = catchAsync(async (req, res) => {
  const result = await userService.getAll(req.query);
  res.json({ status: 'success', data: result.users, meta: result.meta });
});

const getById = catchAsync(async (req, res) => {
  const user = await userService.getById(req.params.id);
  res.json({ status: 'success', data: { user } });
});

const update = catchAsync(async (req, res) => {
  const user = await userService.update(req.params.id, req.body);
  res.json({ status: 'success', data: { user } });
});

const remove = catchAsync(async (req, res) => {
  const result = await userService.softDelete(req.params.id);
  res.json({ status: 'success', ...result });
});

module.exports = { getAll, getById, update, remove };
