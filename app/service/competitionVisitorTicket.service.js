const _ = require('lodash');
const {
  CompetitionVisitorTicket
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
    const competitionVisitorTicket = await CompetitionVisitorTicket.findAll({
      // where: {
      //   execute: false,
      // }
    })

    return competitionVisitorTicket;
  } catch (error) {
    log.error(error);
    throw Exception.setError(error, false);
  }
}

async function showTicketForCompetitionForPosition(competitionVisitorTicket) {
  try {
    const competitionVisitorTicket = await CompetitionVisitorTicket.findAll({
      where: {
        competitionVisitorPositionId: competitionVisitorTicket.competitionVisitorPositionId,
        competitionId: competitionVisitorTicket.competitionId,
      }
    })

    return competitionVisitorTicket;
  } catch (error) {
    log.error(error);
    throw Exception.setError(error, false);
  }
}

async function create(competitionVisitorTicket) {
  try {
    if (_.isUndefined(competitionVisitorTicket.userId))
      throw Exception.setError('شناسه کاربری الزامی است', false);


    const competitionVisitorTicketObject = await CompetitionVisitorTicket.create({
      competitionVisitorPositionId: competitionVisitorTicket.competitionVisitorPositionId,
      userId: competitionVisitorTicket.userId,
      competitionId: competitionVisitorTicket.competitionId,
    })

    return competitionVisitorTicketObject;
  } catch (error) {
    log.error(error);
    throw Exception.setError(error, false);
  }
}

async function show(id) {
  try {
    var competitionVisitorTicket = await CompetitionVisitorTicket.findByPk(id)

    if (!competitionVisitorTicket) {
      throw Exception.setError("این تیکت موجود نمیباشد", true);
    }

    return competitionVisitorTicket;
  } catch (error) {
    log.error(error);
    throw Exception.setError(error, false);
  }
}


async function destroy(id) {
  try {
    const competitionVisitorTicket = CompetitionVisitorTicket.findByPk(id)

    if (!competitionVisitorTicket) {
      throw Exception.setError("این تیکت وجود ندارد", false);
    }

    await competitionVisitorTicket.destroy()
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
  showTicketForCompetitionForPosition,
  destroy
}