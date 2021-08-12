const _ = require('lodash');
const {
  success,
  exception,
  error
} = require('../utils/response.utitlity')
const competitionService = require('../service/competition.service')
const rateService = require('../service/rate.service')
const validate = require('../validations/validator.image.utility')
const {
  Lottery,
  Setting
} = require('../models');
const log = require('../utils/log.utility')


async function create(req, res) {
  try {

    validate.create(
      req.body
    )
    await rateService.create(req.body)

    return success(res, []);
  } catch (error) {
    return exception(res, error.message);
  }
}


async function setIsMain(req, res) {
  try {

    validate.setIsMain(
      req.body.goodId
    )
    await rateService.setIsMain(req.body.goodId)

    return success(res, []);
  } catch (error) {
    return exception(res, error.message);
  }
}

async function getGoodImages(req, res) {
  try {

    validate.getGoodImages(
      req.body.goodId
    )
    await rateService.getGoodImages(req.body.goodId)

    return success(res, []);
  } catch (error) {
    return exception(res, error.message);
  }
}



module.exports = {
  create,
  getGoodImages,
  setIsMain
}