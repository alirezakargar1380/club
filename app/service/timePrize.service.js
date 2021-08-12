const _ = require('lodash');
const {
  TimePrize
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



async function index() {
  try {
    const timePrize = await TimePrize.findAll({
      // where: {
      //   count: {
      //     [Op.gt]: 0
      //   },
      // }
    })

    return timePrize;
  } catch (error) {
    log.error(error);
    throw Exception.setError(error, false);
  }
}

async function ListTimePrizesWithUserId(userId) {
  try {
    const timePrize = await TimePrize.findAll({
      where: {  
        userId: userId,
      }
    })

    return timePrize;
  } catch (error) {
    log.error(error);
    throw Exception.setError(error, false);
  }
}

async function ListTimePrizesInHoure(runTime) {
  try {
    const timePrize = await TimePrize.findAll({
      where: {  
        runTime: runTime,
      }
    })

    return timePrize;
  } catch (error) {
    log.error(error);
    throw Exception.setError(error, false);
  }
}

async function create(timePrize) {
  try {

    await TimePrize.create({
      userId: timePrize.userId,
      runTime: timePrize.runTime,
    })

    return true;
  } catch (error) {
    log.error(error);
    throw Exception.setError(error, false);
  }
}

async function show(id) {
  try {
    var timePrize = await TimePrize.findByPk(id)

    if (!timePrize) {
      throw Exception.setError("این کالا موجود نمیباشد", true);
    }

    return timePrize;
  } catch (error) {
    log.error(error);
    throw Exception.setError(error, false);
  }
}

async function update(id, newTimePrize) {
  try {
    const timePrize = await TimePrize.findByPk(id)

    if (!timePrize) {
      throw Exception.setError("این کالا موجود نمیباشد", true);
    }

    await timePrize.update({
      ...timePrize, //spread out existing task
      ...newTimePrize //spread out body - the differences in the body will over ride the task returned from DB.
    })


    return true;
  } catch (error) {
    log.error(error);
    throw Exception.setError(error, false);
  }
}

async function destroy(id) {
  try {
    const timePrize = TimePrize.findByPk(id)

    if (!timePrize) {
      return res.status(400).json({
        message: 'TimePrize Not Found'
      });
    }

    await timePrize.destroy()

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
  ListTimePrizesWithUserId,
  ListTimePrizesInHoure
}