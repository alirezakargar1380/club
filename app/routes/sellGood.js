var express = require('express');
var router = express.Router();

const sellGoodController = require('../controllers/sellGood.controller')

// http://localhost:3000/sellGood
router.get('/', sellGoodController.index);
router.get('/listSellGoodWithUserid', sellGoodController.listSellGoodWithUserid);
router.post('/', sellGoodController.create);
router.post('/returnCostAfterExpireTime', sellGoodController.returnCostAfterExpireTime);
router.post('/recieveGood', sellGoodController.recieveGood);
router.get('/:id', sellGoodController.show);
router.put('/', sellGoodController.update);
router.delete('/:id', sellGoodController.destroy);

module.exports = router;
