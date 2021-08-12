const _ = require('lodash');
const shortid = require('shortid');
const {
  Winner
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
const prizeService = require('./prize.service');
const walletService = require('./wallet.service');
const wallet = require('../models/wallet');
const {
  prize
} = require('../validations/validator.socket.prize.utility');



async function index() {
  try {
    const winner = await Winner.findAll({
      // where: {
      //   execute: false,
      // }
    })

    return winner;
  } catch (error) {
    log.error(error);
    throw Exception.setError(error, false);
  }
}

async function create(winner) {
  try {
    if (_.isUndefined(winner.userId))
      throw Exception.setError('شناسه کاربری الزامی است', false);


    const winnerObject = await Winner.create({
      userId: winner.userId,
      ticketId: winner.ticketId,
      prizeId: winner.prizeId,
      code: shortid.generate(),
      used: false
    })

    return winnerObject;
  } catch (error) {
    log.error(error);
    throw Exception.setError(error, false);
  }
}

async function show(id) {
  try {
    var winner = await Winner.findByPk(id)

    if (!winner) {
      throw Exception.setError("این برنده موجود نمیباشد", true);
    }

    return winner;
  } catch (error) {
    log.error(error);
    throw Exception.setError(error, false);
  }
}

async function getWinnerForLottery(lotteryId) {
  try {
    var winner = await Winner.findOne({
      where: {
        userId: userId,
      }
    })

    if (!winner) {
      throw Exception.setError("این برنده موجود نمیباشد", true);
    }

    return winner;
  } catch (error) {
    log.error(error);
    throw Exception.setError(error, false);
  }
}

async function executeCode(code) {
  try {
    const winner = await Winner.findAll({
      where: {
        code: code,
      }
    })
    log.error('----------->' + typeof winner[0].used)
    log.error('-----_.isEqual(winner[0].used, true)------>' + _.isEqual(winner[0].used, true))
    if (_.isEqual(_.size(winner), 0)) {
      throw Exception.setError("این برنده موجود نمیباشد", true);
    }

    if (_.isEqual(winner[0].used, true)) {
      log.error('-----"این کد استفاده شده است"------>')
      throw Exception.setError("این کد استفاده شده است", true);
    }
    const prize = await prizeService.show(winner[0].prizeId)

    const today = moment().format('YYYY-MM-DD')
    const expiteDate = moment(new Date(prize.dataValues.createdAt)).add(prize.dataValues.expireDay, 'days').format('YYYY-MM-DD')

    if (expiteDate < today) {
      throw Exception.setError("تاریخ انقضای کد گذشته است", true);
    }

    await walletService.increaseCashForPrize(prize)


    const newWinner = {
      used: true
    }
    await winner[0].update({
      ...winner[0], //spread out existing task
      ...newWinner //spread out body - the differences in the body will over ride the task returned from DB.
    })

    return true;
  } catch (error) {
    log.error(error);
    throw Exception.setError(error, false);
  }
}

async function update(id, newWinner) {
  try {
    const winner = await Winner.findByPk(id)

    if (!winner) {
      throw Exception.setError("این برنده موجود نمیباشد", true);
    }

    await winner.update({
      ...winner, //spread out existing task
      ...newWinner //spread out body - the differences in the body will over ride the task returned from DB.
    })

    return true;
  } catch (error) {
    log.error(error);
    throw Exception.setError(error, false);
  }
}

async function destroy(id) {
  try {
    const winner = Winner.findByPk(id)

    if (!winner) {
      throw Exception.setError("این برنده وجود ندارد", false);
    }

    await winner.destroy()
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
  executeCode
}