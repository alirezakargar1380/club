const _ = require('lodash');
const {
  success,
  exception,
  error
} = require('../utils/response.utitlity')
const competitionService = require('../service/competition.service')
const rateService = require('../service/rate.service')
const validate = require('../validations/validator.rate.utility')
const {
  Lottery,
  Setting
} = require('../models');
const log = require('../utils/log.utility')


async function registerRate(req, res) {
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


module.exports = {
  registerRate
}