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
const validate = require('../validations/validator.ticketMessage.utility')
const ticketMessageService = require('../service/ticketMessage.service')
const walletService = require('../service/wallet.service');
const log = require('../utils/log.utility')

async function index(req, res) {
  try {
    const ticketMessage = await ticketMessageService.index()

    return success(res, ticketMessage);
  } catch (error) {
    return exception(res, error.message);
  }
}

async function create(req, res) {
  try {
    req.body.userId = req.userId;
    log.info('----req.body------>'+ JSON.stringify(req.body))
    validate.create(req.body)

    const ticketMessage = await ticketMessageService.create(
      req.body
    )

    return success(res, ticketMessage)
  } catch (error) {
    return exception(res, error.message);
  }
}


async function show(req, res) {
  try {
    const ticketMessage = await ticketMessageService.show(req.params.id);

    return success(res, ticketMessage);
  } catch (error) {
    return exception(res, error.message);
  }
}

async function update(req, res) {
  try {
    const ticketMessage = await ticketMessageService.update(req.body.id, req.body.newTicketMessage);

    return success(res, ticketMessage);
  } catch (error) {
    return exception(res, error.message);
  }
}

async function destroy(req, res) {
  try {
    await ticketMessageService.destroy(req.params.id);

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