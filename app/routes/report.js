var express = require('express');
var router = express.Router();

const reportController = require('../controllers/report.controller')

// http://localhost:3000/report
router.get('/', reportController.index);
router.post('/', reportController.create);
router.get('/:id', reportController.show);
router.put('/', reportController.update);
router.delete('/:id', reportController.destroy);

module.exports = router;
