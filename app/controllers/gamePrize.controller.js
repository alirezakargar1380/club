const moment = require('moment');
const _ = require('lodash');
const { error, success } = require('../utils/response.utitlity');
const log = require('../utils/log.utility');
const lotteryService = require('../service/lottery.service');
const rouletteService = require('../service/roulette.service');
const prizeService = require('../service/prize.service');
const walletService = require('../service/wallet.service');
const settingService = require('../service/setting.service');
const Exception = require('../utils/error.utility');
const validate = require('../validations/validator.socket.prize.utility');

async function fetchLotteryPrize(req, res) {
  try {
    const prizes = await prizeService.getListPrizeForLotteryWithId(
      req.params.lotteryId
    );
    const userPrizes = await prizeService.getListPrizeForLotteryWithIdAndUserId(
      req.params.lotteryId,
      req.userId
    );
    //set for owner
    // console.log('---userObject.role---------->', userObject.role);
    if (_.isEqual(req.role, 'admin-club')) return success(res, prizes);
    else return success(res, userPrizes);
  } catch (error) {
    log.error(error);
    return error(res, error.message);
  }
}

async function createLotteryPrize(req, res) {
  try {
    const wallet = await walletService.showWithUserId(req.userId);
    const lottery = await lotteryService.show(req.params.lotteryId);
    console.log('------prizes--1----->', wallet);
    if (_.isEqual(req.role, 'userAD-club'))
      if (_.isEqual(wallet.confirmedBy, null)) {
        error(res, 'حساب کاربری شما تایید شده نیست');
        return;
      }

    if (_.isEqual(req.role, 'user-club')) {
      error(res, 'برای این کار شما باید حساب تبلیغاتی داشته باشید');
      return;
    }

    if (
      _.lt(
        wallet.coin,
        lottery.adPrice * req.body.countPrize * req.body.countDay
      )
    ) {
      error(res, 'موجودی سکه  کافی نیست');
      return;
    }
    console.log('------prizes--2----->');
    if (_.isEqual(lottery.lock, true)) {
      error(res, 'این قرعه کشی در حال اجرا میباشد ');
      return;
    }

    console.log('------prizes--3----->');
    const countPrize = req.body.countPrize;
    const countDay = req.body.countDay;
    req.body = _.omit(req.body, ['countPrize']);
    req.body = _.omit(req.body, ['countDay']);
    req.body.category = 1;
    req.body.userId = req.userId;

    let order = 0;
    console.log('------prizes--data------>', req.body);
    for (let indexDay = 0; indexDay < countDay; indexDay++) {
      order = 0;
      for (let indexPrize = 0; indexPrize < countPrize; indexPrize++) {
        const listPrize = await prizeService.getListPrizeForLotteryWithId(
          req.params.lotteryId
        );
        console.log('-------indexDay--------->', indexDay);
        req.body.order = order;
        order++;
        req.body.executeNumber = indexDay;
        console.log('-------indexDay-----data---->');
        validate.prize(req.body);
        console.log('-------indexDay-----data1---->');
        await prizeService.create(req.body);
      }
    }

    const prizes = await prizeService.getListPrizeForLotteryWithId(
      req.params.lotteryId
    );
    const userPrizes = await prizeService.getListPrizeForLotteryWithIdAndUserId(
      req.params.lotteryId,
      req.userId
    );
    // get list admin connected to socket
    // const listAdmin = await socketService.listAdmin();
    // if (!_.isUndefined(listAdmin) || !_.isEmpty(listAdmin))
    //   _.forEach(listAdmin, (admin) => {
    //     console.log('------admin------>', admin.socketId);
    //     io.to(admin.socketId).emit('getPrizes', socketSuccess(prizes));
    //   })
    //set for owner
    console.log('---req.role---------->', req.role);
    if (_.isEqual(req.role, 'admin-club')) success(res, prizes);
    else success(res, userPrizes);
  } catch (error) {
    log.error(error);
    error(res, error.message);
  }
}

async function fetchRoullettePrize(req, res) {
  try {
    const roulettePrizes = await prizeService.getListPrizeForRouletteWithId(
      req.params.rouletteId
    );
    const usreRoulettePrizes = await prizeService.getListPrizeForRouletteWithIdAndUserId(
      req.params.rouletteId,
      req.userId
    );

    if (_.isEqual(req.role, 'admin-club')) success(res, roulettePrizes);
    else success(res, usreRoulettePrizes);
  } catch (error) {
    log.error(error);
    error(res, error.message);
  }
}

async function createRoulettePrize(req, res) {
  try {
    // console.log('--------------------------->', data)
    const setting = await settingService.index();
    if (_.isEqual(_.size(setting), 0))
      throw Exception.setError('لطفا تنظیمات را انجام دهید', true);

    const roulette = await rouletteService.show(req.params.rouletteId);

    var maxDate = moment(roulette.fromDate, 'DD-MM-YYYY')
      .add(roulette.countDay, 'days')
      .format('YYYY-MM-DD');
    for (const date of req.body.prizeDatePicker)
      if (_.gt(date, maxDate))
        throw Exception.setError(`تاریخ غیر مجاز موجود است`, true);

    for (const date of req.body.prizeDatePicker) {
      for (const time of req.body.prizeTimePicker) {
        const priseList = await prizeService.getListPrizeForDayAndTime(
          req.params.rouletteId,
          date,
          time
        );
        log.info('--------_.size(priseList)---->' + _.size(priseList));
        log.info('--------req.body.countPrize---->' + req.body.countPrize);
        log.info(
          '--------_.size(priseList) + req.body.countPrize--->' +
            _.size(priseList) +
            req.body.countPrize
        );
        log.info(
          '--------setting[0].countRoulettePrize--->' +
            setting[0].countRoulettePrize
        );
        if (
          _.gt(
            _.size(priseList) + parseInt(req.body.countPrize),
            setting[0].countRoulettePrize
          )
        )
          throw Exception.setError(
            `در تاریخ ${date}  و ساعت ${time} این تعداد جایگاه جایزه موجود نمیباشد`,
            true
          );
      }
    }
    const count = req.body.countPrize;
    req.body = _.omit(req.body, ['countPrize']);
    req.body.category = 2;
    req.body.userId = req.userId;
    req.body.sequential = true;
    // console.log('------roulettePrize--req.body------>', req.body);
    for (let index = 0; index < count; index++) {
      for (const date of req.body.prizeDatePicker) {
        for (const time of req.body.prizeTimePicker) {
          const listPrize = await prizeService.getListPrizeForDayAndTime(
            req.params.rouletteId,
            req.body,
            time
          );
          // console.log('-------22222555--------->');
          req.body.order = _.size(listPrize);
          req.body.runDate = date;
          req.body.runTime = time;
          await prizeService.create(req.body);
        }
      }
    }
    // console.log('------1111------>');

    const roulettePrizes = await prizeService.getListPrizeForRouletteWithId(
      req.params.rouletteId
    );
    const userRoulettePrizes = await prizeService.getListPrizeForRouletteWithIdAndUserId(
      req.params.rouletteId,
      req.userId
    );

    // we tell the client to execute 'new message'
    // console.log('----------roulettePrizes------------->', roulettePrizes);
    // socket.broadcast.emit('getRoulettePrizes', roulettePrizes);

    // get list admin connected to socket
    // const listAdmin = await socketService.listAdmin();
    // if (!_.isUndefined(listAdmin) || !_.isEmpty(listAdmin))
    //   _.forEach(listAdmin, (admin) => {
    //     io.to(admin.socketId).emit('getPrizes', socketSuccess(roulettePrizes));
    //   })
    // console.log('------2222------>');
    //set for owner
    if (_.isEqual(req.role, 'admin-club')) success(res, roulettePrizes);
    else success(res, userRoulettePrizes);
  } catch (error) {
    log.error(error);
    error(res, error.message);
  }
}

async function confirmPrize(req, res) {
  try {
    if (!_.isEqual(req.role, 'admin-club')) {
      // console.log('-------1-----> ');
      error(res, 'شما به این api دسترسی ندارید');
    } else {
      await prizeService.update(req.params.prizeId, {
        confirmedBy: req.userId,
      });
    }
  } catch (error) {
    log.error(error);
    error(res, error.message);
  }
}

module.exports = {
  fetchLotteryPrize,
  createLotteryPrize,
  fetchRoullettePrize,
  createRoulettePrize,
  confirmPrize,
};
