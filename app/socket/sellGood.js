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
const sellGoodService = require('../service/sellGood.service');
const Exception = require('../utils/error.utility');
const validate = require('../validations/validator.sellGood.utility');

// http://localhost:3000/lottery
const sellGood = (socket, io, socketId, userObject) => {
    // when the client emits 'new lottery', this listens and executes
    socket.on('sellGood', async (data) => {
        try {
            if (_.isUndefined(userObject) || _.isEmpty(userObject))
                throw Exception.setError('این توکن معتبر  نیست', false);

            log.info('-------sellGood----->' + JSON.stringify(data));
            data.userId = userObject.uuid;
            validate.sellGood(data)

            const good = await goodService.show(data.goodId)
            if (_.lt(good.count, data.count)) {
                io.to(socketId).emit('getError', socketError('این تعداد کالا موجود نمیباشد'))

            } else if (_.isEqual(good.type, 1)) {
                io.to(socketId).emit('getError', socketError('این کالا برای فروش نمیباشد'))
            } else {
                // sellGood.userId,
                // sellGood.goodId,
                // sellGood.count
                await sellGoodService.create(data)
                const getSellGood = await sellGoodService.index()
                const getSellGoodForUser = await sellGoodService.listSellGoodWithUserid(userObject.uuid)

                // socket.broadcast.emit('getLotteries', lotterys);
                io.sockets.emit('getSellGood', socketSuccess(getSellGood))
                io.to(socketId).emit('getSellGoodForUser', socketSuccess(getSellGoodForUser))



                // update sel good
                const goods = await goodService.index()
                const goodForUsers = await goodService.ListGoodsWithUserId(userObject.uuid)
                io.sockets.emit('getGoods', socketSuccess(goods))
                io.to(socketId).emit('goodForUsers', socketSuccess(goodForUsers))
            }
        } catch (error) {
            log.error(error);
            io.to(socketId).emit('getError', socketError(error.message))
        }
    });
}

module.exports = sellGood;