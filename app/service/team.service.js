const _ = require('lodash');
const {
  Team
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
    const teams = await Team.findAll({
      // where: {
      //   execute: false,
      // }
    })

    return teams;
  } catch (error) {
    log.error(error);
    throw Exception.setError(error, false);
  }
}


async function listUserTeam(userId) {
  try {
    const teams = await Team.findAll({
      where: {
        userId: userId,
      }
    })

    return teams;
  } catch (error) {
    log.error(error);
    throw Exception.setError(error, false);
  }
}

async function create(team) {
  try {
    if (_.isUndefined(team.userId))
      throw Exception.setError('شناسه کاربری الزامی است', false);


    const teamObject = await Team.create({
      name: team.name,
      userId: team.userId,
    })

    return teamObject;
  } catch (error) {
    log.error(error);
    throw Exception.setError(error, false);
  }
}

async function show(id) {
  try {
    var team = await Team.findByPk(id)

    if (!team) {
      throw Exception.setError("این کمپین موجود نمیباشد", true);
    }

    return team;
  } catch (error) {
    log.error(error);
    throw Exception.setError(error, false);
  }
}

async function update(id, newTeam) {
  try {
    const team = await Team.findByPk(id)

    if (!team) {
      throw Exception.setError("این کمپین موجود نمیباشد", true);
    }

    await team.update({
      ...team, //spread out existing task
      ...newTeam //spread out body - the differences in the body will over ride the task returned from DB.
    })

    return true;
  } catch (error) {
    log.error(error);
    throw Exception.setError(error, false);
  }
}

async function destroy(id) {
  try {
    const team = Team.findByPk(id)

    if (!team) {
      throw Exception.setError("این مسابقه وجود ندارد", false);
    }

    await team.destroy()
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
  listUserTeam
}