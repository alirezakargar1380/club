const _ = require('lodash');
const {
  success,
  exception,
  error
} = require('../utils/response.utitlity')
const competitionService = require('../service/competition.service')
const goodService = require('../service/good.service')
const lotteryService = require('../service/lottery.service')
const rouletteService = require('../service/roulette.service')
const fileService = require('../service/file.service')
const walletService = require('../service/wallet.service')
const validate = require('../validations/validator.image.utility')
const {
  Lottery,
  Setting
} = require('../models');
const log = require('../utils/log.utility');
const {
  good
} = require('../validations/validator.good.utility');
const { console } = require('../utils/log.utility');


async function create(req, res) {
  try {
    req.body.userId = req.userId;

    let file = {
      file: req.body.file,
      type: req.body.type,
      userId: req.userId
    }

    // console.log('-------file---->', file);

    if (!_.includes([1, 2, 3, 4 , 5], req.body.type)) {
      error(res, "نوع فایل معتبر نمیباشد")
    }

    if (_.isEqual(req.body.type, 1))
      if (!req.body.goodId) {
        error(res, "برای این تایپ باید goodId  معرفی گردد")
      }
    else {
      await goodService.show(req.body.goodId)

      file.goodId = req.body.goodId
    }

    if (_.isEqual(req.body.type, 2))
      if (!req.body.lotteryId) {
        error(res, "برای این تایپ باید lotteryId  معرفی گردد")
      }
    else {
      await lotteryService.show(req.body.lotteryId)

      file.lotteryId = req.body.lotteryId
    }

    if (_.isEqual(req.body.type, 3))
      if (!req.body.rouletteId) {
        error(res, "برای این تایپ باید rouletteId  معرفی گردد")
      }
    else {
      await rouletteService.show(req.body.lotteryId)

      file.rouletteId = req.body.rouletteId
    }

    if (_.isEqual(req.body.type, 4))
      if (!req.body.competitionId) {
        error(res, "برای این تایپ باید competitionId  معرفی گردد")
      }
    else {
      await competitionService.show(req.body.competitionId)

      file.competitionId = req.body.competitionId
    }

    
    if (_.isEqual(req.body.type, 5))
      if (!req.body.walletId) {
        error(res, "برای این تایپ باید walletId  معرفی گردد")
      }
    else {
      await walletService.show(req.body.walletId)

      file.walletId = req.body.walletId
    }

    // console.log('--after-----file---->', file);

    validate.create(
      req.body
    )
    await fileService.create(req.body)

    return success(res, []);
  } catch (error) {
    return exception(res, error.message);
  }
}


async function setIsMain(req, res) {
  try {

    const args={
      fileId: parseInt(req.params.fileId)
    }
    validate.setIsMain(args)

    await fileService.setIsMain(parseInt(req.params.fileId))

    return success(res, []);
  } catch (error) {
    return exception(res, error.message);
  }
}

async function getFiles(req, res) {
  try {

    log.info('--------req.params------>'+ JSON.stringify(req.params))
    log.info('--------req.body------>'+ JSON.stringify(req.body))
    log.info('--------req.query------>'+ JSON.stringify(req.query))
    if (!_.includes([1, 2, 3, 4], parseInt(req.params.type))) {
      error(res, "نوع تصویر معتبر نمیباشد")
    }

    let result = []
    if (_.isEqual(parseInt(req.params.type), 1))
    result = await fileService.getListFileForGood(parseInt(req.params.id))

    if (_.isEqual(parseInt(req.params.type), 2))
    result = await fileService.getListFileForLottery(parseInt(req.params.id))

    if (_.isEqual(parseInt(req.params.type), 3))
    result = await fileService.getListFileForRoulette(parseInt(req.params.id))

    if (_.isEqual(parseInt(req.params.type), 4))
    result = await fileService.getListFileForCompetition(parseInt(req.params.id))

    if (_.isEqual(parseInt(req.params.type), 5))
    result = await fileService.getListFileForWallet(parseInt(req.params.id))

    return success(res, result);
  } catch (error) {
    return exception(res, error.message);
  }
}



module.exports = {
  create,
  getFiles,
  setIsMain
}