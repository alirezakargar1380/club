const _ = require('lodash');
const {
  Message
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
    const message = await Message.findAll({
      // where: {
      //   execute: false,
      // }
    })

    return message;
  } catch (error) {
    log.error(error);
    throw Exception.setError(error, false);
  }
}

async function create(message) {
  try {
    const messageObject = await Message.create({
      userId: message.userId,
      isAnswer: message.isAnswer,
      message: message.message,
      ticketMessageId: message.ticketMessageId,
    })

    return messageObject;
  } catch (error) {
    log.error(error);
    throw Exception.setError(error, false);
  }
}

async function show(id) {
  try {
    var message = await Message.findByPk(id)

    if (!message) {
      throw Exception.setError("این آیتم موجود نمیباشد", true);
    }

    return message;
  } catch (error) {
    log.error(error);
    throw Exception.setError(error, false);
  }
}

async function update(id, newMessage) {
  try {
    const message = await Message.findByPk(id)

    if (!message) {
      throw Exception.setError("این آیتم موجود نمیباشد", true);
    }

    await message.update({
      ...message, //spread out existing task
      ...newMessage //spread out body - the differences in the body will over ride the task returned from DB.
    })


    return true;
  } catch (error) {
    log.error(error);
    throw Exception.setError(error, false);
  }
}

async function destroy(id) {
  try {
    const message = Message.findByPk(id)

    await message.destroy()

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