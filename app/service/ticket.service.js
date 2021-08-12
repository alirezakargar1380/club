const _ = require('lodash');
const moment = require('moment');
const {
  Socket,
  Lottery,
  Ticket,
  Prize,
  Setting
} = require('../models');
const {
  Op
} = require('sequelize')
const Sequelize = require('sequelize');
const sequelize = new Sequelize(/*database*/'test', /*username*/'test', /*password*/'test',
    {host: 'localhost', dialect: 'postgres'});
const ticket = require('../models/ticket');
const Exception = require('../utils/error.utility');
const {
  console
} = require('../utils/log.utility');
const log = require('../utils/log.utility')
const walletService = require('../service/wallet.service')
const lotteryService = require('../service/lottery.service')
const settingService = require('../service/setting.service')
const transactionService = require('../service/transaction.service');
const transaction = require('../models/transaction');



async function getListTicketForLottery() {
  try {
    const tickets = await Ticket.findAll({
      where: {
        category: 1
      },
      include: [{
        model: Lottery,
        as: 'tickets'
      }, ]
    })

    return tickets;
  } catch (error) {
    log.error(error);
    throw Exception.setError(error, false);
  }
}


async function getAllListTicketWithLotteryId(lotteryId) {
  try {
    lstTicket = await Ticket.findAll({
      where: {
        lotteryId: lotteryId,
        category: 1,
      },
      order: [
        ['createdAt', 'DESC']
      ]
    });
    return lstTicket;
  } catch (error) {
    log.error(error);
    throw Exception.setError(error, false);
  }
}

async function getListTicketWithLotteryId(lotteryId) {
  try {
    lstTicket = await Ticket.findAll({
      where: {
        lotteryId: lotteryId,
        category: 1,
        used: false
      },
      order: [
        ['createdAt', 'DESC']
      ]
    });
    return lstTicket;
  } catch (error) {
    log.error(error);
    throw Exception.setError(error, false);
  }
}

async function getListTicketWithLotteryIdAndUserId(lotteryId, userId) {
  try {
    lstTicket = await Ticket.findAll({
      where: {
        lotteryId: lotteryId,
        category: 1,
        userId: userId
      },
      order: [
        ['createdAt', 'DESC']
      ]
    });
    return lstTicket;
  } catch (error) {
    log.error(error);
    throw Exception.setError(error, false);
  }
}

async function getListTicketWithLotteryIdAndUserIdNotUsed(lotteryId, userId) {
  try {
    lstTicket = await Ticket.findAll({
      where: {
        lotteryId: lotteryId,
        category: 1,
        userId: userId,
        used: false
      },
      order: [
        ['createdAt', 'DESC']
      ]
    });
    return lstTicket;
  } catch (error) {
    log.error(error);
    throw Exception.setError(error, false);
  }
}

async function getListTicketForRoulette() {
  try {
    const tickets = await Ticket.findAll({
      where: {
        category: 2
      },
      include: [{
        model: Lottery,
        as: 'tickets'
      }, ]
    })

    return tickets;
  } catch (error) {
    log.error(error);
    throw Exception.setError(error, false);
  }
}

async function getListTicketWithRouletteId(rouletteId) {
  try {
    lstTicket = await Ticket.findAll({
      where: {
        rouletteId: rouletteId,
        category: 2
      },
      order: [
        ['createdAt', 'DESC']
      ]
    });
    return lstTicket;
  } catch (error) {
    log.error(error);
    throw Exception.setError(error, false);
  }
}

async function getListTicketWithRouletteIdAndUserId(rouletteId, userId) {
  try {
    lstTicket = await Ticket.findAll({
      where: {
        rouletteId: rouletteId,
        userId: userId,
        category: 2
      },
      order: [
        ['createdAt', 'DESC']
      ]
    });
    return lstTicket;
  } catch (error) {
    log.error(error);
    throw Exception.setError(error, false);
  }
}


async function getListTicketWithRouletteIdAndUserIdForToday(rouletteId, userId) {
  try {
    var toDayDate = new Date();

    var today = moment(new Date()).format('YYYY-MM-DD');
    var towmaroe = moment(new Date(), "DD-MM-YYYY").add(1, 'days').format('YYYY-MM-DD');

log.info('-----------dateTime----->'+today)
log.info('-----------towmaroe----->'+towmaroe)
    lstTicket = await Ticket.findAll({
      where: {
        rouletteId: rouletteId,
        userId: userId,
        category: 2,
        createdAt: {[Op.between]: [today, towmaroe]},
      },
      order: [
        ['createdAt', 'DESC']
      ]
    });
    return lstTicket;
  } catch (error) {
    log.error(error);
    throw Exception.setError(error, false);
  }
}

async function create(ticket) {
  try {

    if (_.isUndefined(ticket.userId))
      throw Exception.setError('شناسه کاربری الزامی است', false);
    log.info('----------555555555555555===========')
    if (_.isEqual(ticket.category, 1)) {
      const lottery = await lotteryService.show(ticket.lotteryId);
      if (_.isEqual(lottery.lock, true))
        throw Exception.setError('این قرعه کشی قفل میباشد', false);

      const setting = await settingService.index();
      log.info('-----setting------->' + JSON.stringify(setting));
      if (_.isEqual(_.size(setting), 0)) {
        throw Exception.setError("لطفا تنظیمات را انجام دهید", true);
      }

      const ticketsForUserId = await getListTicketWithLotteryIdAndUserIdNotUsed(ticket.lotteryId, ticket.userId)

      if (_.lt(setting[0].countTicket, _.size(ticketsForUserId)))
        throw Exception.setError(" شما ماکزیمم تعداد بلیط را دریافت کردید.", true);
    }

    log.info('----------66666666666666===========')
    if (_.isEqual(ticket.category, 2)) {

      const setting = await settingService.index();
      log.info('-----setting------->' + JSON.stringify(setting));
      if (_.isEqual(_.size(setting), 0)) {
        throw Exception.setError("لطفا تنظیمات را انجام دهید", true);
      }

      const ticketsForUserId = await getListTicketWithRouletteIdAndUserIdForToday(ticket.rouletteId, ticket.userId)
      log.warning('-------ticketsForUserId--------->' + JSON.stringify(ticketsForUserId))
      if (_.lt(setting[0].countRouletteTicket, _.size(ticketsForUserId)))
        throw Exception.setError(" شما ماکزیمم تعداد بلیط را برای امروز دریافت کردید.", true);
    }
    log.info('----------777777777777===========')

    if (_.isEqual(ticket.category, 3)) {

      const setting = await settingService.index();
      log.info('-----setting------->' + JSON.stringify(setting));
      if (_.isEqual(_.size(setting), 0)) {
        throw Exception.setError("لطفا تنظیمات را انجام دهید", true);
      }
    }
    log.info('-----buyTicket-------->'+JSON.stringify(walletService))
    await walletService.buyTicket(ticket)
    log.info('-----buyTicket----1---->'+JSON.stringify(walletService))
    await Ticket.create(ticket)

    return true;
  } catch (error) {
    log.error(error);
    throw Exception.setError(error, false);
  }
}

async function show(id) {
  try {
    var ticket = await Ticket.findByPk(id)

    if (!ticket) {
      throw Exception.setError("این تیکت موجود نمیباشد", true);
    }

    return ticket;
  } catch (error) {
    log.error(error);
    throw Exception.setError(error, false);
  }
}

async function update(id, newTicket) {
  try {
    const ticket = await Ticket.findByPk(id)

    if (!ticket) {
      throw Exception.setError("این تیکت موجود نمیباشد", true);
    }

    await ticket.update({
      ...ticket, //spread out existing task
      ...newTicket //spread out body - the differences in the body will over ride the task returned from DB.
    })


    return true;
  } catch (error) {
    log.error(error);
    throw Exception.setError(error, false);
  }
}

async function destroy(id) {
  try {
    const ticket = Ticket.findByPk(id)

    if (!ticket) {
      return res.status(400).json({
        message: 'Ticket Not Found'
      });
    }

    await ticket.destroy()

    return true;
  } catch (error) {
    log.error(error);
    throw Exception.setError(error, false);
  }
}

module.exports = {
  getListTicketForLottery,
  getListTicketWithLotteryId,
  getListTicketForRoulette,
  getListTicketWithRouletteId,
  getListTicketWithRouletteIdAndUserId,
  getListTicketWithLotteryIdAndUserId,
  getListTicketWithLotteryIdAndUserIdNotUsed,
  getAllListTicketWithLotteryId,
  create,
  show,
  update,
  destroy
}