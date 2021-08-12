const _ = require('lodash');
const {
  Socket,
  Lottery
} = require('../models');
const Exception = require('../utils/error.utility');
const {
  console
} = require('../utils/log.utility');
const log = require('../utils/log.utility')


async function checkExist(userId) {
  try {
    const socket = await Socket.findOne({
      where: {
        userId
      }
    });
    if (_.isNull(socket)) {
      return [];
    } else {
      return socket.dataValues;
    }
  } catch (error) {
    log.error(error);
    throw Exception.setError(error, false);
  }
}

async function index() {
  try {

    const sockets = await Socket.findAll({
      include: [{
        model: Lottery,
        as: 'sockets'
      }]
    });

    return sockets;
  } catch (error) {
    log.error(error);
    throw Exception.setError(error, false);
  }
}

async function listAdmin() {
  try {

    const sockets = await Socket.findAll({
      where: {
        role: 'admin-club'
      }
    });

    return sockets;
  } catch (error) {
    log.error(error);
    throw Exception.setError(error, false);
  }
}

async function create(userId, role, lotteryId, socketId) {

  try {
    const socket = await checkExist(userId)

    if (_.isEqual(_.size(socket), 0)) {
      const socketObject = await Socket.create({
        userId: userId,
        socketId: socketId,
        lotteryId : lotteryId,
        role : role
      });

      return socketObject;
    } 

  } catch (error) {
    log.error(error);
    throw Exception.setError(error, false);
  }
}

async function show(userId) {

  try {
    const socketObject = await Socket.findOne({
      where: {
        userId: userId
      }
    });

    return socketObject
  } catch (error) {
    log.error(error);
    throw Exception.setError(error, false);
  }
}

async function destroy(userId) {
  try {
    const socketObject = await Socket.findOne({
      where: {
        userId: userId
      }
    });

    if (!socketObject) {
      throw Exception.setError("این شماره متصل نمیباشد", false);
    }

    socketObject.destroy()

    return true;
  } catch (error) {
    throw Exception.setError(error.message, false);
  }

}

module.exports = {
  index,
  create,
  show,
  checkExist,
  destroy,
  listAdmin
}