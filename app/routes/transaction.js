var express = require('express');
var router = express.Router();

const transactionController = require('../controllers/transaction.controller')

// http://localhost:3000/transaction

router.put('/', transactionController.confirmTransaction);
router.put('/confirmTicketTransaction', transactionController.confirmTicketTransaction);
router.post('/', transactionController.registerTeransaction);
router.post('/registerTicketTeransaction', transactionController.registerTicketTeransaction);
router.get('/getConfirmedTransactionWithUserId/:userId', transactionController.getConfirmedTransactionWithUserId);
router.get('/', transactionController.getAllTransaction);
router.delete('/', transactionController.denayTransaction);

module.exports = router;
