const express = require('express');
const router = express.Router();
const labResultController = require('../controllers/labResult.controller');
const authenticate = require('../middleware/authenticate');

router.use(authenticate);

router.get('/', labResultController.getAllResults);
router.get('/:id', labResultController.getResult);
router.post('/', labResultController.createResult);

module.exports = router;
