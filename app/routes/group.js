var express = require('express');
var router = express.Router();

const groupController = require('../controllers/group.controller')

// http://localhost:3000/lottery
router.get('/', groupController.index);
router.post('/', groupController.create);
router.get('/:id', groupController.show);
router.put('/buyTicketForGroup/:id', groupController.buyTicketForGroup);
router.put('/', groupController.update);
router.delete('/:id', groupController.destroy);

module.exports = router;
