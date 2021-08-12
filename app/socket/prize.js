var express = require('express');
const moment = require('moment');
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
const walletService = require('../service/wallet.service');
const settingService = require('../service/setting.service');
const fieldWorkService = require('../service/fieldWork.service');
const rouletteThread = require('../service/roulette.thread.service');
const authService = require('../service/auth.service');
const Exception = require('../utils/error.utility');
const validate = require('../validations/validator.socket.prize.utility');

// http://localhost:3000/lottery
const prize = (socket, io, socketId, userObject) => {

  // when the client emits 'new prize', this listens and executes
  socket.on('addPrize', async (data) => {
    try {
      if (_.isUndefined(userObject) || _.isEmpty(userObject))
        throw Exception.setError('این توکن معتبر  نیست', false);

      const prizes = await prizeService.getListPrizeForLotteryWithId(data.lotteryId)
      const userPrizes = await prizeService.getListPrizeForLotteryWithIdAndUserId(data.lotteryId, userObject.uuid)
      //set for owner
      // console.log('---userObject.role---------->', userObject.role);
      if (_.isEqual(userObject.role, 'admin-club'))
        io.to(socketId).emit('getPrizes', socketSuccess(prizes));
      else
        io.to(socketId).emit('getPrizes', socketSuccess(userPrizes));
    } catch (error) {
      log.error(error);
      io.to(socketId).emit('getError', socketError(error.message));
    }
  });
  // when the client emits 'new prize', this listens and executes
  socket.on('prize', async (data) => {
    try {

      const wallet = await walletService.showWithUserId(userObject.uuid)
      const lottery = await lotteryService.show(data.lotteryId)
      console.log('------prizes--1----->', wallet)
      if (_.isEqual(userObject.role, 'userAD-club'))
        if (_.isEqual(wallet.confirmedBy, null)) {
          io.to(socketId).emit('getError', "حساب کاربری شما تایید شده نیست");
          return;
        }

      if (_.isEqual(userObject.role, 'user-club')) {
        io.to(socketId).emit('getError', "برای این کار شما باید حساب تبلیغاتی داشته باشید");
        return;
      }

      if (_.lt(wallet.coin, (lottery.adPrice * data.countPrize * data.countDay))) {
        io.to(socketId).emit('getError', "موجودی سکه  کافی نیست");
        return;
      }
      console.log('------prizes--2----->')
      if (_.isEqual(lottery.lock, true)) {
        io.to(socketId).emit('getError', "این قرعه کشی در حال اجرا میباشد ");
        return;
      }

      console.log('------prizes--3----->')
      const countPrize = data.countPrize;
      const countDay = data.countDay;
      data = _.omit(data, ['countPrize']);
      data = _.omit(data, ['countDay']);
      data.category = 1;
      data.userId = userObject.uuid;


      let order = 0
      console.log('------prizes--data------>', data);
      for (let indexDay = 0; indexDay < countDay; indexDay++) {
        order = 0
        for (let indexPrize = 0; indexPrize < countPrize; indexPrize++) {

          const listPrize = await prizeService.getListPrizeForLotteryWithId(data.lotteryId)
          console.log('-------indexDay--------->', indexDay);
          data.order = order;
          order++;
          data.executeNumber = indexDay;
          console.log('-------indexDay-----data---->');
          validate.prize(data)
          console.log('-------indexDay-----data1---->');
          await prizeService.create(data)
        }
      }

      const prizes = await prizeService.getListPrizeForLotteryWithId(data.lotteryId)
      const userPrizes = await prizeService.getListPrizeForLotteryWithIdAndUserId(data.lotteryId, userObject.uuid)
      // get list admin connected to socket 
      const listAdmin = await socketService.listAdmin();
      if (!_.isUndefined(listAdmin) || !_.isEmpty(listAdmin))
        _.forEach(listAdmin, (admin) => {
          console.log('------admin------>', admin.socketId);
          io.to(admin.socketId).emit('getPrizes', socketSuccess(prizes));
        })
      //set for owner
      console.log('---userObject.role---------->', userObject.role);
      if (_.isEqual(userObject.role, 'admin-club'))
        io.to(socketId).emit('getPrizes', socketSuccess(prizes));
      else
        io.to(socketId).emit('getPrizes', socketSuccess(userPrizes));

    } catch (error) {
      log.error(error);
      io.to(socketId).emit('getError', socketError(error.message));
    }
  });

  // when the client emits 'new prize', this listens and executes
  socket.on('addRoulettePrize', async (data) => {

    try {
      if (_.isUndefined(userObject) || _.isEmpty(userObject))
        throw Exception.setError('این توکن معتبر  نیست', false);

      const roulettePrizes = await prizeService.getListPrizeForRouletteWithId(data.rouletteId)
      const usreRoulettePrizes = await prizeService.getListPrizeForRouletteWithIdAndUserId(data.rouletteId, userObject.uuid)

      // we tell the client to execute 'new message'
      // console.log('-------addRoulettePrize---roulettePrizes------------->', _.size(roulettePrizes));


      // socket.broadcast.emit('getRoulettePrizes', roulettePrizes);
      if (_.isEqual(userObject.role, 'admin-club'))
        io.to(socketId).emit('getRoulettePrizes', socketSuccess(roulettePrizes));
      else
        io.to(socketId).emit('getRoulettePrizes', socketSuccess(usreRoulettePrizes));
    } catch (error) {
      log.error(error);
      io.to(socketId).emit('getError', socketError(error.message));
    }
  });



  // when the client emits 'new prize', this listens and executes
  socket.on('roulettePrize', async (data) => {
    try {
      if (_.isUndefined(userObject) || _.isEmpty(userObject))
        throw Exception.setError('این توکن معتبر  نیست', false);

      // console.log('--------------------------->', data)
      const setting = await settingService.index()
      if (_.isEqual(_.size(setting), 0))
        throw Exception.setError("لطفا تنظیمات را انجام دهید", true);

      const roulette = await rouletteService.show(data.rouletteId)

      var maxDate = moment(roulette.fromDate, "DD-MM-YYYY").add(roulette.countDay, 'days').format('YYYY-MM-DD');
      for (const date of data.prizeDatePicker)
        if (_.gt(date, maxDate))
          throw Exception.setError(`تاریخ غیر مجاز موجود است`, true);

      for (const date of data.prizeDatePicker) {
        for (const time of data.prizeTimePicker) {
          const priseList = await prizeService.getListPrizeForDayAndTime(data.rouletteId, date, time)
          log.info('--------_.size(priseList)---->' + _.size(priseList));
          log.info('--------data.countPrize---->' + data.countPrize);
          log.info('--------_.size(priseList) + data.countPrize--->' + _.size(priseList) + data.countPrize);
          log.info('--------setting[0].countRoulettePrize--->' + setting[0].countRoulettePrize);
          if (_.gt(_.size(priseList) + parseInt(data.countPrize), setting[0].countRoulettePrize))
            throw Exception.setError(`در تاریخ ${date}  و ساعت ${time} این تعداد جایگاه جایزه موجود نمیباشد`, true);
        }
      };
      const count = data.countPrize;
      data = _.omit(data, ['countPrize']);
      data.category = 2;
      data.userId = userObject.uuid;
      data.sequential = true;
      // console.log('------roulettePrize--data------>', data);
      for (let index = 0; index < count; index++) {
        for (const date of data.prizeDatePicker) {
          for (const time of data.prizeTimePicker) {
            const listPrize = await prizeService.getListPrizeForDayAndTime(data.rouletteId, data, time)
            // console.log('-------22222555--------->');
            data.order = _.size(listPrize);
            data.runDate = date;
            data.runTime = time;
            await prizeService.create(data)
          }
        }
      }
      // console.log('------1111------>');

      const roulettePrizes = await prizeService.getListPrizeForRouletteWithId(data.rouletteId)
      const userRoulettePrizes = await prizeService.getListPrizeForRouletteWithIdAndUserId(data.rouletteId, userObject.uuid)

      // we tell the client to execute 'new message'
      // console.log('----------roulettePrizes------------->', roulettePrizes);
      // socket.broadcast.emit('getRoulettePrizes', roulettePrizes);

      // get list admin connected to socket 
      const listAdmin = await socketService.listAdmin();
      if (!_.isUndefined(listAdmin) || !_.isEmpty(listAdmin))
        _.forEach(listAdmin, (admin) => {
          io.to(admin.socketId).emit('getPrizes', socketSuccess(roulettePrizes));
        })
      // console.log('------2222------>');
      //set for owner
      if (_.isEqual(userObject.role, 'admin-club'))
        io.to(socketId).emit('getRoulettePrizes', socketSuccess(roulettePrizes));
      else
        io.to(socketId).emit('getRoulettePrizes', socketSuccess(userRoulettePrizes));
    } catch (error) {
      log.error(error);
      io.to(socketId).emit('getError', socketError(error.message));
    }
  });

  // confirm prize
  socket.on('confirmPrize', async (data) => {
    try {
      if (_.isUndefined(userObject) || _.isEmpty(userObject))
        throw Exception.setError('این توکن معتبر  نیست', false);

      if (!_.isEqual(userObject.role, 'admin-club')) {
        // console.log('-------1-----> ');
        io.sockets.emit('getError', socketError('شما به این api دسترسی ندارید'));
      } else {
        await prizeService.update(data.prizeId, {
          confirmedBy: userObject.uuid
        })
      }
    } catch (error) {
      log.error(error);
      io.to(socketId).emit('getError', socketError(error.message));
    }
  });
}

module.exports = prize;