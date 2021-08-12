var express = require('express');
const _ = require('lodash');
const log = require('../utils/log.utility');
const { success, error, exception } = require('../utils/response.utitlity');
const walletService = require('../service/wallet.service');
const lotteryService = require('../service/lottery.service');
const rouletteService = require('../service/roulette.service');
const ticketService = require('../service/ticket.service');
const Exception = require('../utils/error.utility');
const validate = require('../validations/validator.socket.ticket.utility');

async function index(req, res) {
  try {
    const tickets = await ticketService.getListTicketWithLotteryId(
      req.params.lotteryId
    );
    const userTickets = await ticketService.getListTicketWithLotteryIdAndUserId(
      req.params.lotteryId,
      req.userId
    );

    if (_.isEqual(req.role, 'admin-club')) success(res, tickets);
    else success(res, userTickets);
  } catch (error) {
    return exception(res, error.message);
  }
}

async function create(req, res) {
  try {
    const wallet = await walletService.showWithUserId(req.userId);
    const lottery = await lotteryService.show(req.body.lotteryId);
    if (
      _.lt(
        wallet.coin,
        lottery.adPrice * req.body.countPrize * req.body.countDay
      )
    ) {
      throw Exception.setError('موجودی سکه  کافی نیست', true);
    }

    if (_.isEqual(lottery.lock, true)) {
      throw Exception.setError('این قرعه در حال اجرا میباشد ', true);
    }

    // console.log('------req.body.countTicket--------->', req.body.countTicket);
    const count = req.body.countTicket;
    req.body.category = 1;
    req.body.userId = req.userId;
    req.body = _.omit(req.body, ['countTicket']);
    // console.log('------tickets--req.body---5555555--->', req.body);

    for (let index = 0; index < count; index++) {
      const listTicket = await ticketService.getListTicketWithLotteryId(
        req.body.lotteryId
      );
      // console.log('------12--->')
      req.body.order = _.size(listTicket);
      // console.log('------13--->')
      validate.ticket(req.body);
      // console.log('------14--->')
      await ticketService.create(req.body);
    }
    success(res, {});
  } catch (error) {
    return exception(res, error.message);
  }
}

async function show(req, res) {
  try {
    const args = {
      id: req.params.id,
    };

    validate.id(args);

    const ticket = await ticketService.show(req.params.id);

    return success(res, ticket);
  } catch (error) {
    return exception(res, error.message);
  }
}

async function update(req, res) {
  try {
    const args = {
      id: req.params.id,
    };

    validate.id(args);

    const ticket = await ticketService.update(
      req.params.id,
      req.body.newTicket
    );

    return success(res, ticket);
  } catch (error) {
    return exception(res, error.message);
  }
}

async function destroy(req, res) {
  try {
    const args = {
      id: req.params.id,
    };

    validate.id(args);

    await ticketService.destroy(req.params.id);

    return success(res, {});
  } catch (error) {
    return exception(res, error.message);
  }
}

async function rouletteIndex(req, res) {
  try {
    const tickets = await ticketService.getListTicketWithRouletteId(
      req.params.rouletteId
    );
    const ticketsForUserId = await ticketService.getListTicketWithRouletteIdAndUserId(
      req.params.rouletteId,
      req.userId
    );

    // we tell the client to execute 'new ticket'
    // console.log('----------tickets-------->', tickets);
    // socket.broadcast.emit('getRouletteTickets', tickets);
    if (_.isEqual(req.role, 'admin-club')) success(res, tickets);
    else success(res, ticketsForUserId);
  } catch (error) {
    log.error(error);
    return exception(res, error.message);
  }
}

async function rouletteTicketCreate(req, res) {
  try {
    const wallet = await walletService.showWithUserId(req.userId);
    const roulette = await rouletteService.show(req.body.rouletteId);
    // console.log('------rouletteTickets--req.body---11--->', req.body);
    // console.log('------|| !_.isInteger(req.body.countTicket)--req.body---11--->', !_.isInteger(req.body.countTicket));

    if (_.lt(wallet.coin, roulette.adPrice * req.body.countTicket)) {
      throw Exception.setError(' موجودی سکه  کافی نیست', true);
    }

    const count = req.body.countTicket;
    req.body.userId = req.userId;
    req.body.category = 2;
    req.body = _.omit(req.body, ['countTicket']);
    // console.log('------rouletteTickets--req.body------>', req.body);

    for (let index = 0; index < count; index++) {
      const listTicket = await ticketService.getListTicketWithRouletteId(
        req.body.rouletteId
      );
      // console.log('-------listTicket--------->', _.size(listTicket));
      req.body.order = _.size(listTicket);
      validate.ticket(req.body);
      // console.log('-------0000--------->')
      await ticketService.create(req.body);
    }
    // console.log('-------111111--------->')

    success(res, {});
  } catch (error) {
    log.error(error);
    return exception(res, error.message);
  }
}

async function transferTicket(req, res) {
  try {
    const wallet = await walletService.showWithUserId(req.userId);
    const roulette = await rouletteService.show(req.body.rouletteId);
    // console.log('------rouletteTickets--req.body---11--->', req.body);
    // console.log('------|| !_.isInteger(req.body.countTicket)--req.body---11--->', !_.isInteger(req.body.countTicket));

    if (_.lt(wallet.coin, roulette.adPrice * req.body.countTicket)) {
      throw Exception.setError(' موجودی سکه  کافی نیست', true);
    }

    const count = req.body.countTicket;
    req.body.userId = req.userId;
    req.body.category = 2;
    req.body = _.omit(req.body, ['countTicket']);
    // console.log('------rouletteTickets--req.body------>', req.body);

    for (let index = 0; index < count; index++) {
      const listTicket = await ticketService.getListTicketWithRouletteId(
        req.body.rouletteId
      );
      // console.log('-------listTicket--------->', _.size(listTicket));
      req.body.order = _.size(listTicket);
      validate.ticket(req.body);
      // console.log('-------0000--------->')
      await ticketService.create(req.body);
    }
    // console.log('-------111111--------->')

    success(res, {});
  } catch (error) {
    return exception(res, error.message);
  }
}

module.exports = {
  index,
  create,
  show,
  update,
  destroy,
  rouletteIndex,
  rouletteTicketCreate,
  transferTicket,
};
