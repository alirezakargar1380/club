const _ = require('lodash');
const {
  Socket,
  Lottery,
  Ticket,
  Prize,
} = require('../models');
const moment = require('moment'); 
const { Op } = require('sequelize')
const Exception = require('../utils/error.utility');
const {
  console
} = require('../utils/log.utility');
const log = require('../utils/log.utility')



async function index() {
  try {
    const lotteries = await Lottery.findAll({
      // where: {
      //   execute: false,
      // }
    })

    return lotteries;
  } catch (error) {
    log.error(error);
    throw Exception.setError(error, false);
  }
}

async function listRunLottery() {
  try {
    const lotteries = await Lottery.findAll({
      where: {
        runDate: {
          [Op.lte]: moment().format('YYYY-MM-DD')
        },
        runTime: {
          [Op.eq]: moment().format('HH:mm:ss')
        },
        execute: false,
        online: true
      }
    })

    return lotteries;
  } catch (error) {
    log.error(error);
    throw Exception.setError(error, false);
  }
}

async function listRunOfflineLottery() {
  try {
    const lotteries = await Lottery.findAll({
      where: {
        runDate: {
          [Op.lte]: moment().format('YYYY-MM-DD')
        },
        runTime: {
          [Op.eq]: moment().format('HH:mm:ss')
        },
        execute: false,
        online: false
      }
    })

    return lotteries;
  } catch (error) {
    log.error(error);
    throw Exception.setError(error, false);
  }
}

async function listLotteryForDeacreasePriceDaily() {
  try {
    const lotteries = await Lottery.findAll({
      where: {
        execute: false
      }
    })

    return lotteries;
  } catch (error) {
    log.error(error);
    throw Exception.setError(error, false);
  }
}

async function create(lottery) {
  try {
    await Lottery.create({
      title: lottery.title,
      description: lottery.description,
      image: lottery.image,
      runDate: lottery.runDate,
      runTime: lottery.runTime,
      repeat: lottery.repeat,
      online: lottery.online,
      location: lottery.location,
      execute: false,
      countExecute: 0,
      ticketPrice: lottery.ticketPrice,
      ticketPriceDiamond: lottery.ticketPriceDiamond,
      adPrice: lottery.adPrice,
      adPriceDiamond: lottery.adPriceDiamond,
      adPriceAfterWin: lottery.adPriceAfterWin,
      adPriceDiamondAfterWin: lottery.adPriceDiamondAfterWin,
      adPriceForDays: lottery.adPriceForDays,
      adPriceDiamondForDays: lottery.adPriceDiamondForDays,
      adPriceShared: lottery.adPriceShared,
      adPriceDiamondShared: lottery.adPriceDiamondShared
    })

    return true;
  } catch (error) {
    log.error(error);
    throw Exception.setError(error, false);
  }
}

async function show(id) {
  try {
    var lottery = await Lottery.findByPk(id)

    if (!lottery) {
      throw Exception.setError("این قرعه کشی موجود نمیباشد", true);
    }

    return lottery;
  } catch (error) {
    log.error(error);
    throw Exception.setError(error, false);
  }
}

async function update(id , newLottery) {
  try{
    log.info('------newLottery----->'+JSON.stringify(newLottery));
  const lottery = await Lottery.findByPk(id)

  if (!lottery) {
    throw Exception.setError("این قرعه کشی موجود نمیباشد", true);
  }

  await lottery.update({
    ...lottery, //spread out existing task
    ...newLottery //spread out body - the differences in the body will over ride the task returned from DB.
  })

  
  return true;
} catch (error) {
  log.error(error);
  throw Exception.setError(error, false);
}
}

async function destroy(id) {
  try{  const lottery = Lottery.findByPk(id)

  if (!lottery) {
    return res.status(400).json({
      message: 'Lottery Not Found'
    });
  }

  await lottery.destroy()
  
  return true;
} catch (error) {
  log.error(error);
  throw Exception.setError(error, false);
}
}

module.exports = {
  index,
  create,
  show,
  update,
  destroy,
  listRunLottery,
  listRunOfflineLottery,
  listLotteryForDeacreasePriceDaily
}