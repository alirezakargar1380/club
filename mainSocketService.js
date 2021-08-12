const _ = require('lodash')
const {
  socketSuccess,
  exception,
  socketError
} = require('./app/utils/response.utitlity');
const socketService = require('./app/service/socket.service');
const walletService = require('./app/service/wallet.service');
const lotteryService = require('./app/service/lottery.service');
const rouletteService = require('./app/service/roulette.service');
const prizeService = require('./app/service/prize.service');
const ticketService = require('./app/service/ticket.service');
const settingService = require('./app/service/setting.service');
const fieldWorkService = require('./app/service/fieldWork.service');
const rouletteThread = require('./app/service/roulette.thread.service');
const authService = require('./app/service/auth.service');
const goodForPrizeService = require('./app/service/goodForPrize.service');
const goodService = require('./app/service/good.service');
const sellGoodService = require('./app/service/sellGood.service');
const delay = require('delay');


const lotterySocket = require('./app/socket/lottery');
const prizeSocket = require('./app/socket/prize');
const rouletteSocket = require('./app/socket/roulette');
const ticketSocket = require('./app/socket/ticket');
const good = require('./app/socket/good');
const sellGood = require('./app/socket/sellGood');



const mainSocketService = function (io) {


  io.on('connection', async (socket) => {
    var socketId = socket.id;
  //  console.log('--------socket------', socket.id);
    // const userObject = await authService.checkAuth(socket.handshake.query.tocken);
    const userObject = {
      uuid : 'test',
      role : 'admin-club'
    }
  //  console.log('--------userObject------', userObject);
    //add socket to db
    if (!_.isUndefined(userObject) && !_.isEmpty(userObject)) {

    //  console.log('--------if------');
      // 
      await socketService.create(userObject.uuid, userObject.role, socket.handshake.query.lotteryId, socket.id)
      const wallet = await walletService.showWithUserId(userObject.uuid);
      if (_.isUndefined(wallet) || _.isEmpty(wallet))
        await walletService.create({
          userId: userObject.uuid,
          coin: 0,
          diamond: 0
        })

      setTimeout(async () => {
        // get list lotterys
        const lotterys = await lotteryService.index()
        io.to(socketId).emit('getLoteries', socketSuccess(lotterys))

        // get list roulettes
        const roulettes = await rouletteService.index()
        io.to(socketId).emit('getRoulettes', socketSuccess(roulettes));

        // get list fieldWorks
        const fieldWorks = await fieldWorkService.index()
        io.to(socketId).emit('getFieldWorks', socketSuccess(fieldWorks));

        // get list fieldWorks
        const goods = await goodService.index()
        const goodForUsers = await goodService.ListGoodsWithUserId(userObject.uuid)
        io.sockets.emit('getGoods', socketSuccess(goods))
        io.to(socketId).emit('goodForUsers', socketSuccess(goodForUsers))



        //sell good
        const getSellGood = await sellGoodService.index()
        const getSellGoodForUser = await sellGoodService.listSellGoodWithUserid(userObject.uuid)
        io.sockets.emit('getSellGood', socketSuccess(getSellGood))
        io.to(socketId).emit('getSellGoodForUser', socketSuccess(getSellGoodForUser))


        // get setting
        const setting = await settingService.index()
        io.to(socketId).emit('getSettings', socketSuccess(setting));

      }, 1000);
    }

    lotterySocket(socket, io, socketId, userObject);
    prizeSocket(socket, io, socketId, userObject);
    rouletteSocket(socket, io, socketId, userObject);
    ticketSocket(socket, io, socketId, userObject);
    good(socket, io, socketId, userObject);
    sellGood(socket, io, socketId, userObject);

    // when the user disconnects.. perform this
    socket.on('disconnect', async () => {

      await socketService.destroy(userObject.uuid)


    });
  });
}



module.exports.mainSocketService = mainSocketService;