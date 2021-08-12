const _ = require('lodash');
const { success, exception, error } = require('../utils/response.utitlity');
const { Lottery, Setting } = require('../models');
const walletService = require('../service/wallet.service');
const validate = require('../validations/validator.wallet.utility');
const settingService = require('../service/setting.service');

async function index(req, res) {
  try {
    if (!_.isEqual(req.role, 'admin-club'))
      return error(res, 'شما به این api دسترسی ندارید');

    const wallets = await walletService.index();

    return success(res, wallets);
  } catch (error) {
    return exception(res, error.message);
  }
}

async function getUserWallet(req, res) {
  try {
    const wallets = await walletService.showWithUserId(req.userId);

    return success(res, wallets);
  } catch (error) {
    return exception(res, error.message);
  }
}

async function charge(req, res) {
  try {
    // decrease price for create competition
    const setting = await settingService.index();
    if (_.isEqual(_.size(setting), 0))
      return error(res, 'لطفا تنطیمات سایت را انجام دهید');

    if (_.lt(setting[0].constraintForCharge, req.body.amount))
      return error(
        res,
        `شما در هر بار شارژ حداکثر ${setting[0].constraintForCharge} مقدار میتوانید حساب خود را شارژ کنید`
      );

    // console.log('---req.userId,--------->', req.userId);
    let userId = req.userId;

    const args = {
      userId: userId,
      amount: req.body.amount,
      type: req.body.type,
    };

    validate.charge(args);

    await walletService.charge(req.userId, req.body.amount, req.body.type);

    return success(res, {});
  } catch (error) {
    return exception(res, error.message);
  }
}

async function directCharge(req, res) {
  try {
    // decrease price for create competition
    const setting = await settingService.index();
    if (_.isEqual(_.size(setting), 0))
      return error(res, 'لطفا تنطیمات سایت را انجام دهید');

    if (_.lt(setting[0].constraintForCharge, req.body.amount))
      return error(
        res,
        `شما در هر بار شارژ حداکثر ${setting[0].constraintForCharge} مقدار میتوانید حساب خود را شارژ کنید`
      );

    // console.log('---req.userId,--------->', req.userId);
    let userId = req.body.userId;

    const args = {
      userId: userId,
      amount: req.body.amount,
      type: req.body.type,
    };

    validate.charge(args);

    await walletService.charge(req.userId, req.body.amount, req.body.type);

    return success(res, {});
  } catch (error) {
    return exception(res, error.message);
  }
}

async function conversionRatioDiamondToCoin(req, res) {
  try {
    const args = {
      userId: req.userId,
      amount: req.body.amount,
    };

    validate.conversionRatioDiamondToCoin(args);

    await walletService.conversionRatioDiamondToCoin(args.userId, args.amount);

    return success(res, {});
  } catch (error) {
    return exception(res, error.message);
  }
}

async function conversionRatioCoinToDiamond(req, res) {
  try {
    const args = {
      userId: req.userId,
      amount: req.body.amount,
    };

    validate.conversionRatioCoinToDiamond(args);

    await walletService.conversionRatioCoinToDiamond(args.userId, args.amount);

    return success(res, {});
  } catch (error) {
    return exception(res, error.message);
  }
}

async function conversionRatioDiamondToCash(req, res) {
  try {
    const args = {
      userId: req.userId,
      amount: req.body.amount,
    };

    validate.conversionRatioCoinToDiamond(args);

    await walletService.conversionRatioDiamondToCash(args.userId, args.amount);

    return success(res, {});
  } catch (error) {
    return exception(res, error.message);
  }
}

async function confirmed(req, res) {
  try {
    // console.log('-----req.body.id----->' + req.body.id)

    if (!_.isEqual(req.role, 'admin-club'))
      return error(res, 'شما به این api دسترسی ندارید');

    const args = {
      userId: req.userId,
      id: req.body.id,
      step: req.body.step,
    };

    validate.confirmed(args);
    // console.log('-----confirmed--arg--->', args)
    if (_.isEqual(req.body.step, 1))
      await walletService.update(args.id, {
        step1ConfirmedBy: args.userId,
      });

    if (_.isEqual(req.body.step, 2))
      await walletService.update(args.id, {
        step2ConfirmedBy: args.userId,
      });

    if (_.isEqual(req.body.step, 3))
      await walletService.update(args.id, {
        step3ConfirmedBy: args.userId,
      });

    return success(res, {});
  } catch (error) {
    return exception(res, error.message);
  }
}

module.exports = {
  index,
  charge,
  conversionRatioDiamondToCoin,
  conversionRatioCoinToDiamond,
  conversionRatioDiamondToCash,
  confirmed,
  getUserWallet,
  directCharge,
};
