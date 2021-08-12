var express = require('express');
var router = express.Router();

const goodForPrizeController = require('../controllers/goodForPrize.controller')

// http://localhost:3000/good
router.get('/:id', goodForPrizeController.index);
router.get('/listGoodForPrizeWithUserid', goodForPrizeController.listGoodForPrizeWithUserid);
router.post('/', goodForPrizeController.create);
router.get('/:id', goodForPrizeController.show);
router.delete('/:id', goodForPrizeController.destroy);

module.exports = router;
