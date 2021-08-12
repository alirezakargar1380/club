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
const settingService = require('../service/setting.service')
const validate = require('../validations/validator.setting.utility')

async function index(req, res) {
  try {
    const setting = await settingService.index()

    return success(res, setting);
  } catch (error) {
    return exception(res, error.message);
  }
}
// req.body.countTicket
// req.body.countPrize
// req.body.conversionRatioDimondToCoin

async function create(req, res) {
  try {

    if(!_.isEqual(req.role , 'admin-club'))
      return error(res , 'شما به این api دسترسی ندارید')


    validate.create(req.body)

    const setting = await settingService.create({
      countTicket: req.body.countTicket,
      countPrize: req.body.countPrize,
      countSharedPrize: req.body.countSharedPrize,
      countRouletteTicket: req.body.countRouletteTicket,
      countRoulettePrize: req.body.countRoulettePrize,
      conversionRatioDimondToCoin: req.body.conversionRatioDimondToCoin,
      conversionRatioCoinToDimond: req.body.conversionRatioCoinToDimond,
      conversionRatioDaimondToCash: req.body.conversionRatioDaimondToCash,
      percentFromSell: req.body.percentFromSell,
      priceForCoin: req.body.priceForCoin,
      priceDiamondForDiamond: req.body.priceDiamondForDiamond,
      priceForCreateCompetition: req.body.priceForCreateCompetition,
      priceDiamondForCreateCompetition: req.body.priceDiamondForCreateCompetition,
      constraintForCharge: req.body.constraintForCharge,
      constraintForChargeDaimond: req.body.constraintForChargeDaimond,
      constraintForTransfer: req.body.constraintForTransfer,
      constraintForTransferDiamond: req.body.constraintForTransferDiamond,
      tax: req.body.tax,
      constraintForSellGood: req.body.constraintForSellGood
     })

    return success(res, setting)
  } catch (error) {
    return exception(res, error.message);
  }
}

module.exports = {
  index,
  create,
}