const _ = require('lodash');
const {
  success,
  exception,
  error
} = require('../utils/response.utitlity')
const competitionService = require('../service/competition.service')
const winnerService = require('../service/winner.service')
const validate  = require('../validations/validator.group.utility')
const {
  Lottery,
  Setting
} = require('../models');
const log = require('../utils/log.utility')


async function getWinnerForLottery(req, res) {
  try {
    await winnerService.getWinnerForLottery(req.body.lotteryId)

    return success(res, []);
  } catch (error) {
    return exception(res, error.message);
  }
}

async function executeCode(req, res) {
  try {
    await winnerService.executeCode(req.body.code)

    return success(res, []);
  } catch (error) {
    return exception(res, error.message);
  }
}


module.exports = {
  executeCode,
  getWinnerForLottery
}