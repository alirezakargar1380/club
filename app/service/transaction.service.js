const _ = require('lodash');
const {
  Transaction
} = require('../models');
const moment = require('moment');
const {
  Op
} = require('sequelize')
const Exception = require('../utils/error.utility');
const {
  console
} = require('../utils/log.utility');
const log = require('../utils/log.utility')
const walletService = require('./wallet.service')



async function index() {
  try {
    const transactions = await Transaction.findAll({
      // where: {
      //   execute: false,
      // }
    })

    return transactions;
  } catch (error) {
    log.error(error);
    throw Exception.setError(error, false);
  }
}

async function getConfirmedTransactionWithUserId(userId) {
  try {
    const transactions = await Transaction.findAll({
      where: {
        confirmedBy: userId,
        autoExecute: false
      }
    })

    if (_.isUndefined(transactions) || _.isEmpty(transactions)) {
      throw Exception.setError("این رکورد موجود نمیباشد", false);
    }

    return transactions;
  } catch (error) {
    log.error(error);
    throw Exception.setError(error, false);
  }
}

async function registerTransaction(transaction) {
  try {
    await Transaction.create({
      type: transaction.type,
      fromUserId: transaction.fromUserId,
      toUserId: transaction.toUserId,
      description: transaction.description,
      amount: transaction.amount,
      amountDiamond: transaction.amountDiamond,
      autoExecute: false,
    })

    // if (_.isEqual(transaction.autoExecute, true)) {
    //   await transfer(transaction.fromUserId, transaction.fromUserId, transaction.amount, transaction.type)
    // }

    return true;
  } catch (error) {
    log.error(error);
    throw Exception.setError(error, false);
  }
}

async function registerChargeTransaction(transaction) {
  try {
    await Transaction.create({
      type: transaction.type,
      toUserId: transaction.toUserId,
      description: transaction.description,
      amount: transaction.amount,
      amountDiamond: transaction.amountDiamond,
      autoExecute: false,
    })

    // if (_.isEqual(transaction.autoExecute, true)) {
    //   await transfer(transaction.fromUserId, transaction.fromUserId, transaction.amount, transaction.type)
    // }

    return true;
  } catch (error) {
    log.error(error);
    throw Exception.setError(error, false);
  }
}

async function registerTransactionTicket(transaction) {
  try {
    await Transaction.create({
      type: 2,
      fromUserId: transaction.fromUserId,
      toUserId: transaction.toUserId,
      description: transaction.description,
      amount: 0,   
      amountDiamond: 0,
      ticketId: transaction.ticketId,
      autoExecute: true,
    })

    // if (_.isEqual(transaction.autoExecute, true)) {
    //   await transfer(transaction.fromUserId, transaction.fromUserId, transaction.amount, transaction.type)
    // }

    return true;
  } catch (error) {
    log.error(error);
    throw Exception.setError(error, false);
  }
}


async function buyPrize(transaction) {
  try {
    await Transaction.create({
      type: transaction.type,
      fromUserId: transaction.fromUserId,
      toUserId: null,
      description: transaction.description,
      amount: -transaction.amount,
      amountDiamond: -transaction.amountDiamond,
      autoExecute: true,
    })

    return true;
  } catch (error) {
    log.error(error);
    throw Exception.setError(error, false);
  }
}

async function buyTicket(transaction) {
  try {
    await Transaction.create({
      type: transaction.type,
      fromUserId: transaction.fromUserId,
      toUserId: null,
      description: transaction.description,
      amount: -transaction.amount,
      amountDiamond: -transaction.amountDiamond,
      autoExecute: true,
    })

    return true;
  } catch (error) {
    log.error(error);
    throw Exception.setError(error, false);
  }
}


async function chargWallet(transaction) {
  try {
    await Transaction.create({
      type: transaction.type,
      fromUserId: null,
      toUserId: transaction.toUserId,
      description: transaction.description,
      amount: transaction.amount,
      amountDiamond: transaction.amountDiamond,
      autoExecute: true,
    })

    return true;
  } catch (error) {
    log.error(error);
    throw Exception.setError(error, false);
  }
}

async function changeToCash(transaction) {
  try {
    await Transaction.create({
      type: transaction.type,
      fromUserId: null,
      toUserId: transaction.toUserId,
      description: transaction.description,
      amount: transaction.amount,
      amountDiamond: transaction.amountDiamond,
      autoExecute: true,
    })

    return true;
  } catch (error) {
    log.error(error);
    throw Exception.setError(error, false);
  }
}

async function show(id) {
  try {
    var transaction = await Transaction.findByPk(id)

    if (!transaction) {
      throw Exception.setError("این تراکنش موجود نمیباشد", true);
    }

    return transaction;
  } catch (error) {
    log.error(error);
    throw Exception.setError(error, false);
  }
}

async function update(id, newTransaction) {
  try {
    const transaction = await Transaction.findByPk(id)

    await transaction.update({
      ...transaction,
      ...newTransaction 
    })

    return true;
  } catch (error) {
    log.error(error);
    throw Exception.setError(error, false);
  }
}

async function destroy(id) {
  try {
    const transaction = Transaction.findByPk(id)

    if (!transaction) {
      throw Exception.setError("این تراکنش وجود ندارد", false);
    }

    await transaction.destroy()
    return true;
  } catch (error) {
    log.error(error);
    throw Exception.setError(error, false);
  }
}

module.exports = {
  index,
  registerTransaction,
  registerTransactionTicket,
  registerChargeTransaction,
  show,
  update,
  destroy,
  buyTicket,
  chargWallet,
  getConfirmedTransactionWithUserId,
  buyPrize,
  changeToCash
}