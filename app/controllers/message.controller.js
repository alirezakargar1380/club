const _ = require('lodash');
const {
  success,
  exception,
  error
} = require('../utils/response.utitlity')
const {
  Lottery,
  Setting
} = require('../models')
const competitionService = require('../service/competition.service')
const groupService = require('../service/group.service')
const validate = require('../validations/validator.message.utility')
const messageService = require('../service/message.service')
const ticketMessageService = require('../service/ticketMessage.service')
const log = require('../utils/log.utility')

async function index(req, res) {
  try {
    const message = await messageService.index()

    return success(res, message);
  } catch (error) {
    return exception(res, error.message);
  }
}


async function create(req, res) {
  try {
    req.body.userId = req.userId;
    validate.create(req.body)
    log.info('-----ticketMessageService-----1->')
    await ticketMessageService.show(req.body.ticketMessageId)
    log.info('-----ticketMessageService------>')
    const message = await messageService.create(
      req.body
    )

    return success(res, message)
  } catch (error) {
    return exception(res, error.message);
  }
}


async function show(req, res) {
  try {
    const message = await messageService.show(req.params.id);

    return success(res, message);
  } catch (error) {
    return exception(res, error.message);
  }
}

async function update(req, res) {
  try {
    const message = await messageService.update(req.body.id, req.body.newMessage);

    return success(res, message);
  } catch (error) {
    return exception(res, error.message);
  }
}

async function destroy(req, res) {
  try {
    await messageService.destroy(req.params.id);

    return success(res, {})

  } catch (error) {
    return exception(res, error.message);
  }

}

module.exports = {
  index,
  create,
  show,
  update,
  destroy,
}