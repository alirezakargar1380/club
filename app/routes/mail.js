var express = require('express');
const upload = require('../utils/multer.utitlity');
var router = express.Router();

const mailController = require('../controllers/mail.controller')

// http://localhost:3000/mail
router.get('/', mailController.index);
router.post('/', mailController.create);

module.exports = router;
