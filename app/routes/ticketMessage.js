var express = require('express');
const upload = require('../utils/multer.utitlity');
var router = express.Router();

const ticketMessageController = require('../controllers/ticketMessage.controller')

// http://localhost:3000/ticketMessageController
router.get('/', ticketMessageController.index);
router.post('/', ticketMessageController.create);
router.get('/:id', ticketMessageController.show);
router.put('/', ticketMessageController.update);
router.delete('/:id', ticketMessageController.destroy);

module.exports = router;
