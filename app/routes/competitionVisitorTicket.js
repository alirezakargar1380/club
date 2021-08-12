var express = require('express');
var router = express.Router();

const competitionVisitorTicketController = require('../controllers/competitionVisitorTicket.controller')

// http://localhost:3000/competitionMemberController
router.get('/', competitionVisitorTicketController.index);
router.post('/', competitionVisitorTicketController.create);
router.get('/:id', competitionVisitorTicketController.show);
router.delete('/:id', competitionVisitorTicketController.destroy);

module.exports = router;
