var express = require('express');
const _ = require('lodash');
const log = require('../utils/log.utility');
const {
  socketError,
  socketSuccess
} = require('../utils/response.utitlity');
const socketService = require('../service/socket.service');
const walletService = require('../service/wallet.service');
const lotteryService = require('../service/lottery.service');
const rouletteService = require('../service/roulette.service');
const prizeService = require('../service/prize.service');
const ticketService = require('../service/ticket.service');
const settingService = require('../service/setting.service');
const fieldWorkService = require('../service/fieldWork.service');
const rouletteThread = require('../service/roulette.thread.service');
const Exception = require('../utils/error.utility');
const authService = require('../service/auth.service');
const validate = require('../validations/validator.socket.ticket.utility');

// http://localhost:3000/lottery
const ticket = (socket, io, socketId, userObject) => {


  // when the client emits 'new prize', this listens and executes
  socket.on('addTicket', async (data) => {
    try {
      if (_.isUndefined(userObject) || _.isEmpty(userObject))
        throw Exception.setError('این توکن معتبر  نیست', false);

      const tickets = await ticketService.getListTicketWithLotteryId(data.lotteryId)
      const userTickets = await ticketService.getListTicketWithLotteryIdAndUserId(data.lotteryId, userObject.uuid)

      // console.log('-----addPrize--------->');
      // we tell the client to execute 'new ticket'
      // socket.broadcast.emit('getTickets', tickets);
      if (_.isEqual(userObject.role, 'admin-club'))
        io.to(socketId).emit('getTickets', socketSuccess(tickets));
      else
        io.to(socketId).emit('getTickets', socketSuccess(userTickets));
    } catch (error) {
      log.error(error);
      io.to(socketId).emit('getError', socketError(error.message));
    }
  });
  // when the client emits 'new ticket', this listens and executes
  socket.on('ticket', async (data) => {
    try {
      if (_.isUndefined(userObject) || _.isEmpty(userObject))
        throw Exception.setError('این توکن معتبر  نیست', false);

      const wallet = await walletService.showWithUserId(userObject.uuid)
      const lottery = await lotteryService.show(data.lotteryId)
      if (_.lt(wallet.coin, (lottery.adPrice * data.countPrize * data.countDay))) {
        throw Exception.setError("موجودی سکه  کافی نیست", true);
      }

      if (_.isEqual(lottery.lock, true)) {
        throw Exception.setError("این قرعه در حال اجرا میباشد ", true);
      }

      // console.log('------data.countTicket--------->', data.countTicket);
      const count = data.countTicket;
      data.category = 1;
      data.userId = userObject.uuid;
      data = _.omit(data, ['countTicket']);
      // console.log('------tickets--data---5555555--->', data);


      for (let index = 0; index < count; index++) {
        const listTicket = await ticketService.getListTicketWithLotteryId(data.lotteryId)
        // console.log('------12--->')
        data.order = _.size(listTicket);
        // console.log('------13--->')
        validate.ticket(data)
        // console.log('------14--->')
        await ticketService.create(data)
      }
      // console.log('------1--->')
      const tickets = await ticketService.getListTicketWithLotteryId(data.lotteryId)
      const userTickets = await ticketService.getListTicketWithLotteryIdAndUserId(data.lotteryId, userObject.uuid)

      // we tell the client to execute 'new ticket'
      // socket.broadcast.emit('getTickets', tickets);
      // get list admin connected to socket 
      const listAdmin = await socketService.listAdmin();
      if (!_.isUndefined(listAdmin) || !_.isEmpty(listAdmin))
        _.forEach(listAdmin, (admin) => {
          io.to(admin.socketId).emit('getTickets', socketSuccess(tickets));
        })
      // console.log('------2-->')
      //set for owner
      if (_.isEqual(userObject.role, 'admin-club'))
        io.to(socketId).emit('getTickets', socketSuccess(tickets));
      else
        io.to(socketId).emit('getTickets', socketSuccess(userTickets));
    } catch (error) {
      log.error(error);
      io.to(socketId).emit('getError', socketError(error.message));
    }
  });


  // when the client emits 'new prize', this listens and executes
  socket.on('addRouletteTickets', async (data) => {
    try {
      if (_.isUndefined(userObject) || _.isEmpty(userObject))
        throw Exception.setError('این توکن معتبر  نیست', false);

      const tickets = await ticketService.getListTicketWithRouletteId(data.rouletteId)
      const ticketsForUserId = await ticketService.getListTicketWithRouletteIdAndUserId(data.rouletteId, userObject.uuid)

      // we tell the client to execute 'new ticket'
      // console.log('----------tickets-------->', tickets);
      // socket.broadcast.emit('getRouletteTickets', tickets);
      if (_.isEqual(userObject.role, 'admin-club'))

        io.to(socketId).emit('getRouletteTickets', socketSuccess(tickets));
      else
        io.to(socketId).emit('getRouletteTickets', socketSuccess(ticketsForUserId));
    } catch (error) {
      log.error(error);
      io.to(socketId).emit('getError', socketError(error.message));
    }
  });

  socket.on('rouletteTickets', async (data) => {
    try {
      if (_.isUndefined(userObject) || _.isEmpty(userObject))
        throw Exception.setError('این توکن معتبر  نیست', false);

      const wallet = await walletService.showWithUserId(userObject.uuid)
      const roulette = await rouletteService.show(data.rouletteId)
      // console.log('------rouletteTickets--data---11--->', data);
      // console.log('------|| !_.isInteger(data.countTicket)--data---11--->', !_.isInteger(data.countTicket));

      if (_.lt(wallet.coin, (roulette.adPrice * data.countTicket))) {
        throw Exception.setError(" موجودی سکه  کافی نیست", true);
      }

      const count = data.countTicket;
      data.userId = userObject.uuid;
      data.category = 2;
      data = _.omit(data, ['countTicket']);
      // console.log('------rouletteTickets--data------>', data);


      for (let index = 0; index < count; index++) {
        const listTicket = await ticketService.getListTicketWithRouletteId(data.rouletteId)
        // console.log('-------listTicket--------->', _.size(listTicket));
        data.order = _.size(listTicket);
        validate.ticket(data)
        // console.log('-------0000--------->')
        await ticketService.create(data)
      }
      // console.log('-------111111--------->')
      const tickets = await ticketService.getListTicketWithRouletteId(data.rouletteId)
      const userTickets = await ticketService.getListTicketWithRouletteIdAndUserId(data.rouletteId, userObject.uuid)

      // we tell the client to execute 'new ticket'
      // console.log('----------tickets-------->', tickets);
      // socket.broadcast.emit('getRouletteTickets', tickets);
      // get list admin connected to socket 
      const listAdmin = await socketService.listAdmin();
      if (!_.isUndefined(listAdmin) || !_.isEmpty(listAdmin))
        _.forEach(listAdmin, (admin) => {
          io.to(admin.socketId).emit('getTickets', socketSuccess(tickets));
        })
      //set for owner
      if (_.isEqual(userObject.role, 'admin-club'))
        io.to(socketId).emit('getRouletteTickests', socketSuccess(tickets));
      else
        io.to(socketId).emit('getRouletteTickests', socketSuccess(userTickets));
    } catch (error) {
      log.error(error);
      io.to(socketId).emit('getError', socketError(error.message));
    }
  });


  socket.on('transferTicket', async (data) => {
    try {
      if (_.isUndefined(userObject) || _.isEmpty(userObject))
        throw Exception.setError('این توکن معتبر  نیست', false);

      const wallet = await walletService.showWithUserId(userObject.uuid)
      const roulette = await rouletteService.show(data.rouletteId)
      // console.log('------rouletteTickets--data---11--->', data);
      // console.log('------|| !_.isInteger(data.countTicket)--data---11--->', !_.isInteger(data.countTicket));

      if (_.lt(wallet.coin, (roulette.adPrice * data.countTicket))) {
        throw Exception.setError(" موجودی سکه  کافی نیست", true);
      }

      const count = data.countTicket;
      data.userId = userObject.uuid;
      data.category = 2;
      data = _.omit(data, ['countTicket']);
      // console.log('------rouletteTickets--data------>', data);


      for (let index = 0; index < count; index++) {
        const listTicket = await ticketService.getListTicketWithRouletteId(data.rouletteId)
        // console.log('-------listTicket--------->', _.size(listTicket));
        data.order = _.size(listTicket);
        validate.ticket(data)
        // console.log('-------0000--------->')
        await ticketService.create(data)
      }
      // console.log('-------111111--------->')
      const tickets = await ticketService.getListTicketWithRouletteId(data.rouletteId)
      const userTickets = await ticketService.getListTicketWithRouletteIdAndUserId(data.rouletteId, userObject.uuid)

      // we tell the client to execute 'new ticket'
      // console.log('----------tickets-------->', tickets);
      // socket.broadcast.emit('getRouletteTickets', tickets);
      // get list admin connected to socket 
      const listAdmin = await socketService.listAdmin();
      if (!_.isUndefined(listAdmin) || !_.isEmpty(listAdmin))
        _.forEach(listAdmin, (admin) => {
          io.to(admin.socketId).emit('getTickets', socketSuccess(tickets));
        })
      //set for owner
      if (_.isEqual(userObject.role, 'admin-club'))
        io.to(socketId).emit('getRouletteTickests', socketSuccess(tickets));
      else
        io.to(socketId).emit('getRouletteTickests', socketSuccess(userTickets));
    } catch (error) {
      log.error(error);
      io.to(socketId).emit('getError', socketError(error.message));
    }
  });
}

module.exports = ticket;