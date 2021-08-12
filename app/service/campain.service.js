const _ = require('lodash');
const {
  Campain
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
const walletService = require('./wallet.service')
const settingService = require('./setting.service')



async function index() {
  try {
    const campains = await Campain.findAll({
      // where: {
      //   execute: false,
      // }
    })

    return campains;
  } catch (error) {
    log.error(error);
    throw Exception.setError(error, false);
  }
}

async function create(campain) {
  try {
    if (_.isUndefined(campain.userId))
      throw Exception.setError('شناسه کاربری الزامی است', false);


    const campainObject = await Campain.create({
      name: campain.name,
      descrption: campain.descrption,
      userId: campain.userId,
    })

    return campainObject;
  } catch (error) {
    log.error(error);
    throw Exception.setError(error, false);
  }
}

async function show(id) {
  try {
    var campain = await Campain.findByPk(id)

    if (!campain) {
      throw Exception.setError("این کمپین موجود نمیباشد", true);
    }

    return campain;
  } catch (error) {
    log.error(error);
    throw Exception.setError(error, false);
  }
}

async function update(id, newCampainn) {
  try {
    const campain = await Campain.findByPk(id)

    if (!campain) {
      throw Exception.setError("این کمپین موجود نمیباشد", true);
    }

    await campain.update({
      ...campain, //spread out existing task
      ...newCampainn //spread out body - the differences in the body will over ride the task returned from DB.
    })

    return true;
  } catch (error) {
    log.error(error);
    throw Exception.setError(error, false);
  }
}

async function destroy(id) {
  try {
    const campain = Campain.findByPk(id)

    if (!campain) {
      throw Exception.setError("این مسابقه وجود ندارد", false);
    }

    await campain.destroy()
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
  destroy
}