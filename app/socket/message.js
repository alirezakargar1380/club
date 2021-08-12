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
const messageService = require('../service/message.service');
const Exception = require('../utils/error.utility');
const validate = require('../validations/validator.message.utility');
const message = require('../models/message');

// http://localhost:3000/message
const message = (socket, io, socketId, userObject) => {
    // when the client emits 'new lottery', this listens and executes
    socket.on('message', async (data) => {
        try {
            if (_.isUndefined(userObject) || _.isEmpty(userObject))
            throw Exception.setError('این توکن معتبر  نیست', false);

            data.fromUserId = userObject.uuid;
            validate.create(data)
            // data.fromUserId, 
            // data.toUserId, 
            // data.message, 
            await messageService.create(data)
            const messages = await messageService.index()
            const messageForUsers = await messageService.showMessageForUser(userObject.uuid)
            if (_.isEqual(userObject.role, 'admin-club'))
                io.to(socketId).emit('getMessages', socketSuccess(messages))
            else
                io.to(socketId).emit('getMessages', socketSuccess(messageForUsers))
        } catch (error) {
            log.error(error);
            io.to(socketId).emit('getError', socketError(error.message));
        }
    });
}

module.exports = message;