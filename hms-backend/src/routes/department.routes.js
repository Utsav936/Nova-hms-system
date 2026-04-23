const express = require('express');
const router = express.Router();
const { getAll, getById, create, update, remove } = require('../controllers/department.controller');
const authenticate = require('../middleware/authenticate');
const authorize = require('../middleware/authorize');
const validate = require('../middleware/validate');
const { createDepartmentSchema, updateDepartmentSchema } = require('../validators/general.validator');

router.get('/', authenticate, getAll);
router.get('/:id', authenticate, getById);
router.post('/', authenticate, authorize('admin'), validate(createDepartmentSchema), create);
router.patch('/:id', authenticate, authorize('admin'), validate(updateDepartmentSchema), update);
router.delete('/:id', authenticate, authorize('admin'), remove);

module.exports = router;
