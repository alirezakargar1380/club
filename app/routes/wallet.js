var express = require('express');
var router = express.Router();
const basicAuth = require('express-basic-auth');

const walletController = require('../controllers/wallet.controller');

// http://localhost:3000/wallet
router.get('/', walletController.index);
router.get('/getUserWallet', walletController.getUserWallet);
router.post(
  '/direct/charge',
  basicAuth({ users: { 'shid': 'test' }, challenge: true }),
  walletController.directCharge
);
router.post('/', walletController.charge);
router.post(
  '/conversionRatioDiamondToCoin',
  walletController.conversionRatioDiamondToCoin
);
router.post(
  '/conversionRatioCoinToDiamond',
  walletController.conversionRatioCoinToDiamond
);
router.post(
  '/conversionRatioDiamondToCash',
  walletController.conversionRatioDiamondToCash
);
router.put('/confirmed', walletController.confirmed);

module.exports = router;
