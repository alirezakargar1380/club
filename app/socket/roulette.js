var express = require('express');
const _ = require('lodash');
const {
  socketError,
  socketSuccess
} = require('../utils/response.utitlity');
const log = require('../utils/log.utility');
const socketService = require('../service/socket.service');
const lotteryService = require('../service/lottery.service');
const rouletteService = require('../service/roulette.service');
const prizeService = require('../service/prize.service');
const ticketService = require('../service/ticket.service');
const settingService = require('../service/setting.service');
const fieldWorkService = require('../service/fieldWork.service');
const rouletteThread = require('../service/roulette.thread.service');
const validate = require('../validations/validator.socket.roulette.utility');
const Exception = require('../utils/error.utility');
const ticket = require('../models/ticket');

// http://localhost:3000/lottery
const roulette = (socket, io, socketId, userObject) => {



  // when the client emits 'new lottery', this listens and executes
  socket.on('runRoulette', async (data) => {
    try {
      if (_.isUndefined(userObject) || _.isEmpty(userObject))
        throw Exception.setError('این توکن معتبر  نیست', false);

      // console.log('----data-------->', data)
      const ticket = await ticketService.show(data.ticketId);
      // console.log('----ticket-------->', ticket)
      // console.log('----data-------->', data)
      if (_.isEqual(ticket.dataValues.used, true))
        throw Exception.setError(`این بلیط استفاده شده است`, true);

      // data.rouletteId, 
      // data.ticketId, 
      await rouletteThread.run(data.rouletteId, data.ticketId);

      const tickets = await ticketService.getListTicketWithRouletteId(data.rouletteId)
      const userTickets = await ticketService.getListTicketWithRouletteIdAndUserId(data.rouletteId, userObject.uuid)

      const listAdmin = await socketService.listAdmin();
      if (!_.isUndefined(listAdmin) || !_.isEmpty(listAdmin))
        _.forEach(listAdmin, (admin) => {
          io.to(admin.socketId).emit('getRouletteTickets', socketSuccess(tickets));
        })
      //set for owner
      if (_.isEqual(userObject.role, 'admin-club'))
        io.to(socketId).emit('getRouletteTickets', socketSuccess(tickets));
      else
        io.to(socketId).emit('getRouletteTickets', socketSuccess(userTickets));
      // console.log('---roulette-----4------');
      // socket.broadcast.emit('getRouletteTickets', tickets);
      // io.to(socketId).emit('getRouletteTickets', socketSuccess(tickets));
    } catch (error) {
      log.error(error);
      io.to(socketId).emit('getError', socketError(error.message));
    }
  });

  // when the client emits 'new roulette', this listens and executes
  socket.on('roulette', async (data) => {
    try {
      if (_.isUndefined(userObject) || _.isEmpty(userObject))
        throw Exception.setError('این توکن معتبر  نیست', false);

      // console.log('-------data-----> ', data);
      validate.roulette(data)
      // data.title, 
      // data.description, 
      // data.image, 
      // data.execute, 
      // data.datepicker, 
      // data.timepicker,
      // data.repeat,
      // data.countExecute,
      // data.lock,
      // data.ticketPrice,
      // data.adPrice
      // data.adPriceForDays
      // data.adPriceAfterWin
      if (!_.isEqual(userObject.role, 'admin-club')) {
        io.to(socketId).emit('getError', socketError('شما به این api دسترسی ندارید'));
      } else {
        // console.log('------create roulette---------------');
        await rouletteService.create(data)

        const roulettes = await rouletteService.index()

        // socket.broadcast.emit('getRoulettes', roulettes);
        io.sockets.emit('getRoulettes', socketSuccess(roulettes));
      }
    } catch (error) {
      io.to(socketId).emit('getError', socketError(error.message));
    }
  });
}

module.exports = roulette;