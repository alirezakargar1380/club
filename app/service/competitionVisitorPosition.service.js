const _ = require('lodash');
const {
  CompetitionVisitorPosition
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



async function index(competitionId) {
  try {
    const competitionVisitorPosition = await CompetitionVisitorPosition.findAll({
      where: {
        competitionId: competitionId,
      }
    })

    return competitionVisitorPosition;
  } catch (error) {
    log.error(error);
    throw Exception.setError(error, false);
  }
}

async function create(competitionVisitorPosition) {
  try {
    if (_.isUndefined(competitionVisitorPosition.userId))
      throw Exception.setError('شناسه کاربری الزامی است', false);


    const competitionVisitorPositionObject = await CompetitionVisitorPosition.create({
      position: competitionVisitorPosition.position,
      count: competitionVisitorPosition.count,
      ticketPrice: competitionVisitorPosition.ticketPrice,
      ticketPriceDiamond: competitionVisitorPosition.ticketPriceDiamond,
      userId: competitionVisitorPosition.userId,
      competitionId: competitionVisitorPosition.competitionId,
    })

    return competitionVisitorPositionObject;
  } catch (error) {
    log.error(error);
    throw Exception.setError(error, false);
  }
}

async function show(id) {
  try {
    var competitionVisitorPosition = await CompetitionVisitorPosition.findByPk(id)

    if (!competitionVisitorPosition) {
      throw Exception.setError("این جایگاه موجود نمیباشد", true);
    }

    return competitionVisitorPosition;
  } catch (error) {
    log.error(error);
    throw Exception.setError(error, false);
  }
}

async function update(id, newCompetitionVisitorPosition) {
  try {
    const competitionVisitorPosition = await CompetitionVisitorPosition.findByPk(id)

    if (!competitionVisitorPosition) {
      throw Exception.setError("این جایگاه موجود نمیباشد", true);
    }

    await competitionVisitorPosition.update({
      ...competitionVisitorPosition, //spread out existing task
      ...newCompetitionVisitorPosition //spread out body - the differences in the body will over ride the task returned from DB.
    })

    return true;
  } catch (error) {
    log.error(error);
    throw Exception.setError(error, false);
  }
}

async function destroy(id) {
  try {
    const competitionVisitorPosition = CompetitionVisitorPosition.findByPk(id)

    if (!competitionVisitorPosition) {
      throw Exception.setError("این مسابقه وجود ندارد", false);
    }

    await competitionVisitorPosition.destroy()
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