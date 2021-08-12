const _ = require('lodash');
const {
  success,
  exception,
  error
} = require('../utils/response.utitlity')
const mailService = require('../service/mail.service')
const validate = require('../validations/validator.mail.utility')
const {
  Lottery,
  Setting
} = require('../models');
const log = require('../utils/log.utility');
const {
  good
} = require('../validations/validator.good.utility');
const { console } = require('../utils/log.utility');

async function index(req, res) {
  try {
    const message = await mailService.index()

    return success(res, message);
  } catch (error) {
    return exception(res, error.message);
  }
}


async function create(req, res) {
  try {
    log.info('--------req.body---->'+JSON.stringify(req.body))
    req.body.userId = req.userId;

    validate.create(req.body)
    log.info('--------req.body--1-->')
    const mail = await mailService.create(
      req.body,
      req.userId
    )

    return success(res, mail)
  } catch (error) {
    return exception(res, error.message);
  }
}

module.exports = {
  index, 
  create
}