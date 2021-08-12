var express = require('express');
var router = express.Router();

const settingController = require('../controllers/setting.controller')

// http://localhost:8080/setting
router.get('/', settingController.index);
router.post('/', settingController.create);

module.exports = router;
