var express = require('express');
const upload = require('../utils/multer.utitlity');
var router = express.Router();

const messageController = require('../controllers/message.controller')

// http://localhost:3000/messageController
router.get('/', messageController.index);
router.post('/', messageController.create);
router.get('/:id', messageController.show);
router.put('/', messageController.update);
router.delete('/:id', messageController.destroy);

module.exports = router;
