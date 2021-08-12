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
const Exception = require('../utils/error.utility');
const validate = require('../validations/validator.socket.lottery.utility');

// http://localhost:3000/lottery
const lottery = (socket, io, socketId, userObject) => {
    // when the client emits 'new lottery', this listens and executes
    socket.on('lottery', async (data) => {
        try {
            if (_.isUndefined(userObject) || _.isEmpty(userObject))
            throw Exception.setError('این توکن معتبر  نیست', false);

            // console.log('-------userObject-----> ', userObject);
            // console.log('-------data-----> ', data);
            validate.lottery(data)
            // data.title, 
            // data.description, 
            // data.online,
            // data.location 
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
                // console.log('-------1-----> ');
                io.sockets.emit('getError', socketError('شما به این api دسترسی ندارید'));
            } else {
                // console.log('-------2-----> ');
                await lotteryService.create(data)
                const lotterys = await lotteryService.index()

                // socket.broadcast.emit('getLotteries', lotterys);
                io.sockets.emit('getLoteries', socketSuccess(lotterys))
            }
        } catch (error) {
            log.error(error);
            io.to(socketId).emit('getError', socketError(error.message));
        }
    });
}

module.exports = lottery;