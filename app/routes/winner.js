var express = require('express');
var router = express.Router();

const winnerController = require('../controllers/winner.controller')

// http://localhost:3000/winner
router.post('/', winnerController.executeCode);
router.post('/getWinnerForLottery', winnerController.getWinnerForLottery);

module.exports = router;
