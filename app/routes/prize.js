var express = require('express');
var router = express.Router();

const prizeController = require('../controllers/gamePrize.controller');

// http://localhost:3000/lottery
router.get('/lotteryPrize/:lotteryId', prizeController.fetchLotteryPrize);
router.post('/lotteryPrize/:lotteryId', prizeController.createLotteryPrize);
router.get('/roulettePrize/:rouletteId', prizeController.fetchRoullettePrize);
router.post('/roulettePrize/:rouletteId', prizeController.createRoulettePrize);
router.post('/confirmPrize/:prizeId', prizeController.confirmPrize);

module.exports = router;
