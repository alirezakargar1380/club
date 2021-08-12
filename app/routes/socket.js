var express = require('express');
var router = express.Router();

const socketController = require('../controllers/socket.controller')

// http://localhost:8080/socket
router.get('/', socketController.index);
router.get('/:mobile', socketController.show);
router.post('/', socketController.create);
router.delete('/:mobile', socketController.destroy);

module.exports = router;
