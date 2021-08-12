var express = require('express');
var router = express.Router();

const ticketController = require('../controllers/ticket.controller');

// http://localhost:3000/ticket
router.get('/:lotteryId', ticketController.index);
router.post('/', ticketController.create);
router.get('/:id', ticketController.show);
router.put('/:id', ticketController.update);
router.delete('/:id', ticketController.destroy);
router.get('/roulette/:rouletteId', ticketController.rouletteIndex);
router.post('/roulette', ticketController.rouletteTicketCreate);
router.post('/transfer', ticketController.transferTicket);

module.exports = router;
