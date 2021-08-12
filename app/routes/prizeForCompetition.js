var express = require('express');
var router = express.Router();

const prizeController = require('../controllers/prize.controller')

// http://localhost:3000/good
router.get('/', prizeController.index);
router.post('/', prizeController.create);

module.exports = router;
