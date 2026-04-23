const catchAsync = require('../utils/catchAsync');
const staffService = require('../services/staff.service');

const getAllStaff = catchAsync(async (req, res) => {
  const staff = await staffService.getAll({
    search: req.query.search
  });

  res.status(200).json({
    status: 'success',
    results: staff.length,
    data: staff,
  });
});

const getStaff = catchAsync(async (req, res) => {
  const staff = await staffService.getById(req.params.id);

  res.status(200).json({
    status: 'success',
    data: staff,
  });
});

const createStaff = catchAsync(async (req, res) => {
  const newStaff = await staffService.create(req.body);

  res.status(201).json({
    status: 'success',
    data: newStaff,
  });
});

const updateStaff = catchAsync(async (req, res) => {
  const updatedStaff = await staffService.update(req.params.id, req.body);

  res.status(200).json({
    status: 'success',
    data: updatedStaff,
  });
});

const deleteStaff = catchAsync(async (req, res) => {
  await staffService.delete(req.params.id);

  res.status(204).json({
    status: 'success',
    data: null,
  });
});

module.exports = {
  getAllStaff,
  getStaff,
  createStaff,
  updateStaff,
  deleteStaff,
};
