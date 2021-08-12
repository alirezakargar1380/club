const _ = require('lodash');
const {
  Socket,
  Lottery,
  Ticket,
  Prize,
  Setting
} = require('../models');
const Exception = require('../utils/error.utility');
const {
  Op
} = require('sequelize')
const {
  console
} = require('../utils/log.utility');
const log = require('../utils/log.utility')
const walletService = require('../service/wallet.service')
const lotteryService = require('../service/lottery.service')
const rouletteService = require('./roulette.service')
const settingService = require('../service/setting.service');
const moment = require('moment');
const {
  roulette
} = require('../validations/validator.socket.roulette.utility');



async function getListPrizeForLottery() {
  try {
    const prizes = await Prize.findAll({
      where: {
        category: 1
      },
      include: [
        // {
        //   model: Lottery,
        //   as: 'prizes'
        // },
      ]
    })

    return prizes;
  } catch (error) {
    log.error(error);
    throw Exception.setError(error, false);
  }
}


async function getListPrizeForLotteryWithId(lotteryId) {
  try {
    lstPrize = await Prize.findAll({
      where: {
        lotteryId: lotteryId,
        category: 1
      },
      order: [
        ['createdAt', 'DESC']
      ]
    });
    return lstPrize;
  } catch (error) {
    log.error(error);
    throw Exception.setError(error, false);
  }
}

async function getListPrizeForLotteryWithIdForThisExecute(lotteryId, executeNumber) {
  try {
    lstPrize = await Prize.findAll({
      where: {
        lotteryId: lotteryId,
        category: 1,
        executeNumber: executeNumber
      },
      order: [
        ['createdAt', 'DESC']
      ]
    });
    return lstPrize;
  } catch (error) {
    log.error(error);
    throw Exception.setError(error, false);
  }
}

async function getListConfirmedPrizeForLotteryWithIdForThisExecute(lotteryId, executeNumber) {
  try {
    lstPrize = await Prize.findAll({
      where: {
        lotteryId: lotteryId,
        category: 1,
        executeNumber: executeNumber,
        confirmedBy: {
          [Op.ne]: null
        }
      },
      order: [
        ['createdAt', 'DESC']
      ]
    });
    return lstPrize;
  } catch (error) {
    log.error(error);
    throw Exception.setError(error, false);
  }
}


async function getListPrizeForLotteryWithIdNotExecue(lotteryId) {
  try {
    lstPrize = await Prize.findAll({
      where: {
        lotteryId: lotteryId,
        category: 1,
        statusPay: {
          [Op.in]: [0, 1]
        },
      },
      order: [
        ['createdAt', 'DESC']
      ]
    });
    return lstPrize;
  } catch (error) {
    log.error(error);
    throw Exception.setError(error, false);
  }
}


async function getListPrizeForLotteryWithIdAndUserId(lotteryId, userId) {
  try {
    lstPrize = await Prize.findAll({
      where: {
        lotteryId: lotteryId,
        category: 1,
        userId: userId
      },
      order: [
        ['createdAt', 'DESC']
      ]
    });
    return lstPrize;
  } catch (error) {
    log.error(error);
    throw Exception.setError(error, false);
  }
}

async function getListPrizeForRoulette() {
  try {
    const prizes = await Prize.findAll({
      where: {
        category: 2
      },
      include: [
        // {
        //   model: Lottery,
        //   as: 'prizes'
        // },
      ]
    })

    return prizes;
  } catch (error) {
    log.error(error);
    throw Exception.setError(error, false);
  }
}


async function getListPrizeForRouletteWithId(rouletteId) {
  try {
    lstPrize = await Prize.findAll({
      where: {
        category: 2,
        rouletteId: rouletteId
      },
      order: [
        ['createdAt', 'DESC']
      ]
    });
    return lstPrize;
  } catch (error) {
    log.error(error);
    throw Exception.setError(error, false);
  }
}


async function getListPrizeForRouletteWithIdAndUserId(rouletteId, userId) {
  try {
    lstPrize = await Prize.findAll({
      where: {
        category: 2,
        rouletteId: rouletteId,
        userId: userId
      },
      order: [
        ['createdAt', 'DESC']
      ]
    });
    return lstPrize;
  } catch (error) {
    log.error(error);
    throw Exception.setError(error, false);
  }
}

async function getListPrizeForRouletteWithIdForDayAndTime(rouletteId, date, time) {

  log.info('----------------time------>'+time)
  log.info('---------moment(date).------time------>'+moment(date).format('YYYY-MM-DD'))
  try {
    lstPrize = await Prize.findAll({
      where: {
        category: 2,
        rouletteId: rouletteId,
        runDate: moment(date).format('YYYY-MM-DD'),
        runTime: time
      },
      order: [
        ['createdAt', 'DESC']
      ]
    });
    return lstPrize;
  } catch (error) {
    log.error(error);
    throw Exception.setError(error, false);
  }
}

async function getListPrizeForRouletteWithIdAndUserIdForDayAndTime(rouletteId, userId, date, time) {
  try {
    lstPrize = await Prize.findAll({
      where: {
        category: 2,
        rouletteId: rouletteId,
        userId: userId,
        runDate: moment(date).format('YYYY-MM-DD'),
        runTime: time
      },
      order: [
        ['createdAt', 'DESC']
      ]
    });
    return lstPrize;
  } catch (error) {
    log.error(error);
    throw Exception.setError(error, false);
  }
}


async function getListPrizeForDayAndTime(rouletteId, date, time) {
  try {
    lstPrize = await Prize.findAll({
      where: {
        category: 2,
        rouletteId: rouletteId,
        runDate: moment(date).format('YYYY-MM-DD'),
        runTime: time
      },
      order: [
        ['createdAt', 'DESC']
      ]
    });
    return lstPrize;
  } catch (error) {
    log.error(error);
    throw Exception.setError(error, false);
  }
}


async function create(prize) {
  try {

    if (_.isUndefined(prize.userId))
      throw Exception.setError('شناسه کاربری الزامی است', false);

    if (_.isEqual(prize.category, 1)) {
      log.info(`--------prize--1----> ${JSON.stringify(prize)}`)
      const lottery = await lotteryService.show(prize.lotteryId);
      if (_.isEqual(lottery.lock, true))
        throw Exception.setError('این قرعه کشی قفل میباشد', false);

      const setting = await settingService.index();

      if (_.isEqual(_.size(setting), 0)) {
        throw Exception.setError("لطفا تنظیمات را انجام دهید", true);
      }

      const prizessForUserId = await getListPrizeForLotteryWithId(prize.lotteryId)

      if (_.lt(setting[0].countPrize, _.size(prizessForUserId)))
        throw Exception.setError(" ماکزیمم تعداد جایزه برای این قرعه کشی تعریف شده است.", true);
        log.info(`--------prize--1---2-> ${JSON.stringify(prize)}`)
      await walletService.buyPrize(prize)

      prize.statusPay = 1;
      log.info(`--------prize--1--3--> ${JSON.stringify(prize)}`)
      await Prize.create(prize)
    }

    if (_.isEqual(prize.category, 2)) {
      log.info(`--------prize--2----> ${JSON.stringify(prize)}`)
      // log.error('-----------before-------rouletteService.show(---->'+prize.rouletteId)
      // log.error('-----------before-------rouletteService>'+JSON.stringify(rouletteService))
      // const roulette = await rouletteService.show(prize.rouletteId);
      // log.error('-----------after------rouletteService.show(----->')
      // const setting = await settingService.index();

      // if (_.isEqual(_.size(setting), 0)) {
      //   throw Exception.setError("لطفا تنظیمات را انجام دهید", true);
      // }

      // const prizessForUserId = await getListPrizeForRouletteWithId(prize.rouletteId)

      // if (_.lt(setting[0].countRoulettePrize, _.size(prizessForUserId)))
      //   throw Exception.setError(" ماکزیمم تعداد جایزه برای این قرعه کشی تعریف شده است.", true);


      await walletService.buyPrize(prize)

      prize.statusPay = 1;

      await Prize.create(prize)

    }



    return true;
  } catch (error) {
    log.error(error);
    throw Exception.setError(error, false);
  }
}

async function show(id) {
  try {
    var prize = await Prize.findByPk(id)

    if (!prize) {
      throw Exception.setError("این جایزه موجود نمیباشد", true);
    }

    return prize;
  } catch (error) {
    log.error(error);
    throw Exception.setError(error, false);
  }
}


async function update(id, newPrize) {
  try {
    const prize = await Prize.findByPk(id)

    if (!prize) {
      throw Exception.setError("این جایزه موجود نمیباشد", true);
    }

    await prize.update({
      ...prize, //spread out existing task
      ...newPrize //spread out body - the differences in the body will over ride the task returned from DB.
    })


    return true;
  } catch (error) {
    log.error(error);
    throw Exception.setError(error, false);
  }
}

async function destroy(id) {
  try {
    const prize = Prize.findByPk(id)

    if (!prize) {
      return res.status(400).json({
        message: 'Prize Not Found'
      });
    }

    await prize.destroy()

    return true;
  } catch (error) {
    log.error(error);
    throw Exception.setError(error, false);
  }
}

module.exports = {
  getListPrizeForLottery,
  getListPrizeForLotteryWithId,
  getListPrizeForLotteryWithIdNotExecue,
  getListPrizeForLotteryWithIdAndUserId,
  getListPrizeForLotteryWithIdForThisExecute,
  getListConfirmedPrizeForLotteryWithIdForThisExecute,
  getListPrizeForRoulette,
  getListPrizeForRouletteWithId,
  getListPrizeForRouletteWithIdAndUserId,
  getListPrizeForDayAndTime,
  getListPrizeForRouletteWithIdForDayAndTime,
  getListPrizeForRouletteWithIdAndUserIdForDayAndTime,
  create,
  show,
  update,
  destroy,
  getListPrizeForLottery
}