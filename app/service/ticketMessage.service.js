const _ = require('lodash');
const {
  TicketMessage
} = require('../models');
const moment = require('moment');
const {
  Op
} = require('sequelize')
const Exception = require('../utils/error.utility');
const {
  console
} = require('../utils/log.utility');
const log = require('../utils/log.utility')
const competitionService = require('./competition.service')
const groupService = require('./group.service')



async function index() {
  try {
    const ticketMessage = await TicketMessage.findAll({
      // where: {
      //   execute: false,
      // }
    })

    return ticketMessage;
  } catch (error) {
    log.error(error);
    throw Exception.setError(error, false);
  }
}

async function create(ticketMessage) {
  try {
    const ticketMessageObject = await TicketMessage.create({
      subject: ticketMessage.subject,
      description: ticketMessage.description,
      priority: ticketMessage.priority,
      state: ticketMessage.state,
      userId: ticketMessage.userId,
    })

    return true;
  } catch (error) {
    log.error(error);
    throw Exception.setError(error, false);
  }
}

async function show(id) {
  try {
    var ticketMessage = await TicketMessage.findByPk(id)

    if (!ticketMessage) {
      throw ticketMessage.setError("این آیتم موجود نمیباشد", true);
    }

    return ticketMessage;
  } catch (error) {
    log.error(error);
    throw Exception.setError(error, false);
  }
}

async function update(id, newTicketMessage) {
  try {
    const ticketMessage = await TicketMessage.findByPk(id)

    if (!ticketMessage) {
      throw Exception.setError("این آیتم موجود نمیباشد", true);
    }

    await ticketMessage.update({
      ...ticketMessage, //spread out existing task
      ...newTicketMessage //spread out body - the differences in the body will over ride the task returned from DB.
    })


    return true;
  } catch (error) {
    log.error(error);
    throw Exception.setError(error, false);
  }
}

async function destroy(id) {
  try {
    const ticketMessage = TicketMessage.findByPk(id)

    await ticketMessage.destroy()

    return true;
  } catch (error) {
    log.error(error);
    throw Exception.setError(error, false);
  }
}

module.exports = {
  index,
  create,
  show,
  update,
  destroy,
}