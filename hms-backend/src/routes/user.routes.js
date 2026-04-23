const express = require('express');
const router = express.Router();
const { getAll, getById, update, remove } = require('../controllers/user.controller');
const authenticate = require('../middleware/authenticate');
const authorize = require('../middleware/authorize');

router.use(authenticate, authorize('admin'));

router.get('/', getAll);
router.get('/:id', getById);
router.patch('/:id', update);
router.delete('/:id', remove);

module.exports = router;
