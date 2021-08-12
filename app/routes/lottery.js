var express = require('express');
var router = express.Router();

const lotteryController = require('../controllers/lottery.controller')

// http://localhost:3000/lottery
router.get('/', lotteryController.index);
router.post('/', lotteryController.create);
router.get('/:id', lotteryController.show);
router.put('/:id', lotteryController.update);
router.delete('/:id', lotteryController.destroy);

module.exports = router;
