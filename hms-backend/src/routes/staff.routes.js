const express = require('express');
const staffController = require('../controllers/staff.controller');
const authenticate = require('../middleware/authenticate');
const authorize = require('../middleware/authorize');

const router = express.Router();

router.use(authenticate);
router.use(authorize('admin'));

router
  .route('/')
  .get(staffController.getAllStaff)
  .post(staffController.createStaff);

router
  .route('/:id')
  .get(staffController.getStaff)
  .patch(staffController.updateStaff)
  .delete(staffController.deleteStaff);

module.exports = router;
