var express = require('express');
var router = express.Router();

const testController = require('../controllers/test.controller')

// http://localhost:3000/sellGood
router.get('/', testController.index);
module.exports = router;
