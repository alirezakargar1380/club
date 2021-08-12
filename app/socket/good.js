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
const goodService = require('../service/good.service');
const Exception = require('../utils/error.utility');
const validate = require('../validations/validator.good.utility');

// http://localhost:3000/lottery
const good = (socket, io, socketId, userObject) => {
    // when the client emits 'new lottery', this listens and executes
    socket.on('good', async (data) => {
        try {
            // console.log('----good-------->', data)
            // console.log('----good----userObject---->', userObject)
            // console.log('----good----_.isUndefined(userObject)---->', _.isUndefined(userObject))
            // console.log('----good----_.isEmpty(userObject)---->', _.isEmpty(userObject))
            if (_.isUndefined(userObject) || _.isEmpty(userObject))
                throw Exception.setError('این توکن معتبر  نیست', false);

            data.userId = userObject.uuid;
            validate.good(data)

            if (!_.includes(['admin-club', 'userAD-club'], userObject.role))
                throw Exception.setError('کاربر معمولی نمیتواند کالا ثبت کند', false);
            // data.goodId, 
            // data.description, 
            // data.prizeId, 
            // data.userId, 
            // console.log('------userObject.uuid------>', userObject.uuid);
            await goodService.create(data)
            const goods = await goodService.index()
            const goodForUsers = await goodService.ListGoodsWithUserId(userObject.uuid)
            // socket.broadcast.emit('getLotteries', lotterys);
            io.sockets.emit('getGoods', socketSuccess(goods))
            setTimeout(async () => {
                // console.log('------goodForUsers.uuid------>', goodForUsers);
                io.to(socketId).emit('goodForUsers', socketSuccess(goodForUsers))
            }, 1000);
        } catch (error) {
            log.error(error);
            io.to(socketId).emit('getError', socketError(error.message));
        }
    });
}

module.exports = good;