const _ = require('lodash');
const {
  success,
  exception,
  error
} = require('../utils/response.utitlity')
const {
  Lottery,
  Setting
} = require('../models')
const transactionService = require('../service/transaction.service')
const walletService = require('../service/wallet.service')
const ticketService = require('../service/ticket.service')
const validate = require('../validations/validator.transaction.utility')

async function getAllTransaction(req, res) {
  try {

    if (!_.isEqual(req.role, 'admin-club'))
      return error(res, 'شما به این api دسترسی ندارید')

    const allTransaction = await transactionService.index()

    return success(res, allTransaction)
  } catch (error) {
    return exception(res, error.message);
  }
}

// req.body.userId,
async function getConfirmedTransactionWithUserId(req, res) {
  try {

    if (!_.isEqual(req.role, 'admin-club'))
      return error(res, 'شما به این api دسترسی ندارید')

    const args = {
      userId: req.params.userId
    };

    validate.getConfirmedTransactionWithUserId(args)

    const allTransaction = await transactionService.getConfirmedTransactionWithUserId(
      args.userId,
    )

    return success(res, allTransaction)
  } catch (error) {
    return exception(res, error.message);
  }
}

async function registerChargeTransaction(req, res) {
  try {
    const setting = await settingService.index();
    if (_.isEqual(_.size(setting), 0))
      return error(res, "لطفا تنطیمات سایت را انجام دهید")

      if (_.lt(setting[0].constraintForCharge, req.body.amount))
      return error(res, `شما در هر بار شارژ حداکثر ${setting[0].constraintForCharge} مقدار میتوانید حساب خود را شارژ کنید`)


    // console.log('--registerTeransaction-------body---0>', req.body);
    const args = {
      type: req.body.type,
      toUserId: req.userId,
      description: 'شارژ کیف پول',
      amount: req.body.amount
    };
    // console.log('--registerTeransaction-------args--->', args);
    validate.registerChargeTransaction(args)

    const wallet = await walletService.showWithUserId(req.body.toUserId);
    if (_.isUndefined(wallet) || _.isEmpty(wallet)) 
    return error(res, 'شخصی با این مشخصات در کلاب موجود نیست')

    await transactionService.registerChargeTransaction(args)

    return success(res, {})
  } catch (error) {
    // console.log('--error.message)-------body---0>', error.message);
    return exception(res, error.message);
  }
}


// type: transaction.type,
// fromUserId: transaction.fromUserId,
// toUserId: transaction.toUserId,
// description: transaction.description,
// amount: transaction.amount,
// autoExecute: false,

async function registerTeransaction(req, res) {
  try {
    const setting = await settingService.index();
    if (_.isEqual(_.size(setting), 0))
      return error(res, "لطفا تنطیمات سایت را انجام دهید")

    if (_.gt(setting[0].constraintForTransfer, req.body.amount))
    return error(res, `حداکثر مقدار انتقال ${setting[0].constraintForTransfer} میباشد`)

    // console.log('--registerTeransaction-------body---0>', req.body);
    const args = {
      type: req.body.type,
      fromUserId: req.userId,
      toUserId: req.body.toUserId,
      description: req.body.description,
      amount: req.body.amount
    };
    // console.log('--registerTeransaction-------args--->', args);
    validate.registerTeransaction(args)

    const wallet = await walletService.showWithUserId(req.body.toUserId);
    if (_.isUndefined(wallet) || _.isEmpty(wallet)) 
    return error(res, 'شخصی با این مشخصات در کلاب موجود نیست')

    await transactionService.registerTransactionTicket(args)

    return success(res, {})
  } catch (error) {
    // console.log('--error.message)-------body---0>', error.message);
    return exception(res, error.message);
  }
}


async function registerTicketTeransaction(req, res) {
  try {
    // console.log('--registerTeransaction-------body---0>', req.body);
    const args = {
      fromUserId: req.userId,
      toUserId: req.body.toUserId,
      description: req.body.description,
      ticketId: req.body.ticketId
    };
    // console.log('--registerTeransaction-------args--->', args);
    validate.registerTicketTeransaction(args)

    const wallet = await walletService.showWithUserId(req.body.toUserId);
    if (_.isUndefined(wallet) || _.isEmpty(wallet)) 
    return error(res, 'شخصی با این مشخصات در کلاب موجود نیست')

    await transactionService.registerTransaction(args)

    return success(res, {})
  } catch (error) {
    // console.log('--error.message)-------body---0>', error.message);
    return exception(res, error.message);
  }
}

// req.body.userId,
// req.body.transactionId
async function confirmTransaction(req, res) {
  try {

    // console.log('----req.body--------->', req.body);

    // console.log('----req.body--------->', params);
    // console.log('----req.body--------->', req.query);
    if (!_.isEqual(req.role, 'admin-club'))
      return error(res, 'شما به این api دسترسی ندارید')

    const args = {
      userId: req.userId,
      transactionId: req.body.transactionId,
    };

    // console.log('----confirmedTransaction--------->', args);

    validate.confirmedTransaction(args)

    const tarnsaction = await transactionService.show(
      args.transactionId
    )

    if (!_.isNull(tarnsaction.confirmedBy))
      return error(res, 'این تراکنش انجام شده است')


    const transaction = await transactionService.show(args.transactionId)

    await walletService.transferCash(
      transaction.fromUserId,
      transaction.toUserId,
      transaction.amount,
      transaction.type
    )

    const newTransaction = {
      confirmedBy: args.userId,
      denayBy: null,
    }
    await transactionService.update(
      args.transactionId,
      newTransaction
    )

    return success(res, {})
  } catch (error) {
    return exception(res, error.message);
  }
}

// req.body.userId,
// req.body.transactionId
async function confirmCharge(req, res) {
  try {

    // console.log('----req.body--------->', req.body);

    // console.log('----req.body--------->', params);
    // console.log('----req.body--------->', req.query);
    if (!_.isEqual(req.role, 'admin-club'))
      return error(res, 'شما به این api دسترسی ندارید')

    const args = {
      userId: req.userId,
      transactionId: req.body.transactionId,
    };

    // console.log('----confirmedTransaction--------->', args);

    validate.confirmedTransaction(args)

    const tarnsaction = await transactionService.show(
      args.transactionId
    )

    if (!_.isNull(tarnsaction.confirmedBy))
      return error(res, 'این تراکنش انجام شده است')



    await walletService.charge(
      transaction.toUserId,
      transaction.amount,
      transaction.type
    )

    const newTransaction = {
      confirmedBy: args.userId,
      denayBy: null,
    }
    await transactionService.update(
      args.transactionId,
      newTransaction
    )

    return success(res, {})
  } catch (error) {
    return exception(res, error.message);
  }
}

// req.body.userId,
// req.body.transactionId
async function confirmTicketTransaction(req, res) {
  try {

    // console.log('----req.body--------->', req.body);

    // console.log('----req.body--------->', params);
    // console.log('----req.body--------->', req.query);
    if (!_.isEqual(req.role, 'admin-club'))
      return error(res, 'شما به این api دسترسی ندارید')

    const args = {
      userId: req.userId,
      transactionId: req.body.transactionId,
    };

    // console.log('----confirmedTransaction--------->', args);

    validate.confirmedTicketTransaction(args)

    const tarnsaction = await transactionService.show(
      args.transactionId
    )

    if (!_.isNull(tarnsaction.confirmedBy))
      return error(res, 'این تراکنش انجام شده است')


    const transaction = await transactionService.show(args.transactionId)

    await ticketService.update(
      transaction.ticketId,
      {
       userId : transaction.toUserId
      }
    )

    const newTransaction = {
      confirmedBy: args.userId,
      denayBy: null,
    }
    await transactionService.update(
      args.transactionId,
      newTransaction
    )

    return success(res, {})
  } catch (error) {
    return exception(res, error.message);
  }
}

// req.body.userId,
// req.body.transactionId
async function denayTransaction(req, res) {
  try {

    if (!_.isEqual(req.role, 'admin-club'))
      return error(res, 'شما به این api دسترسی ندارید')

    const args = {
      userId: req.userId,
      transactionId: req.body.transactionId,
    };

    validate.confirmedTransaction(args)

    if (!_.isEqual(req.role, 'admin-club')) 
    return error(res, 'شما به این api دسترسی ندارید')

    const tarnsaction = await transactionService.show(
      args.transactionId
    )

    if (!_.isNull(tarnsaction.confirmedBy))
      return error(res, 'این تراکنش انجام شده است')

    const newTransaction = {
      confirmedBy: null,
      denayBy: args.userId,
    }
    await transactionService.update(
      args.transactionId,
      newTransaction
    )

    return success(res, {})
  } catch (error) {
    return exception(res, error.message);
  }
}


module.exports = {
  getAllTransaction,
  getConfirmedTransactionWithUserId,
  registerChargeTransaction,
  registerTeransaction,
  registerTicketTeransaction,
  confirmTransaction,
  confirmTicketTransaction,
  confirmCharge,
  denayTransaction
}