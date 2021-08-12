const _ = require('lodash');
const { Competition } = require('../models');
const moment = require('moment');
const { Op } = require('sequelize');
const Exception = require('../utils/error.utility');
const { console } = require('../utils/log.utility');
const log = require('../utils/log.utility');
const walletService = require('../service/wallet.service');
const settingService = require('../service/setting.service');

async function index() {
  try {
    const competitions = await Competition.findAll({
      // where: {
      //   execute: false,
      // }
    });

    return competitions;
  } catch (error) {
    log.error(error);
    throw Exception.setError(error, false);
  }
}

async function getCompetitionWithCampainId(campainId) {
  try {
    const competitions = await Competition.findAll({
      where: {
        campainId: campainId,
      },
    });

    return competitions;
  } catch (error) {
    log.error(error);
    throw Exception.setError(error, false);
  }
}

async function create(competition) {
  try {
    if (_.isUndefined(competition.userId))
      throw Exception.setError('شناسه کاربری الزامی است', false);

    const competitionObject = await Competition.create({
      title: competition.title,
      description: competition.description,
      image: competition.image,
      runDate: competition.runDate,
      runTime: competition.runTime,
      type: competition.type,
      countGroup: competition.countGroup,
      countMember: competition.countMember,
      countLevel: competition.countLevel,
      countWinner: competition.countWinner,
      userId: competition.userId,
      city: competition.city,
      priceForUser: competition.priceForUser,
      metaData: competition.metaData
        ? JSON.stringify(competition.metaData)
        : '',
      prizeExist: competition.metaData ? competition.prizeExist : false,
    });

    return competitionObject;
  } catch (error) {
    log.error(error);
    throw Exception.setError(error, false);
  }
}

async function show(id) {
  try {
    log.info('----id------->' + id);
    var competition = await Competition.findByPk(id);

    if (!competition) {
      throw Exception.setError('این مسابقه موجودس نمیباشد', true);
    }

    return competition;
  } catch (error) {
    log.error(error);
    throw Exception.setError(error, false);
  }
}

async function update(id, newCompetition) {
  try {
    const competition = await Competition.findByPk(id);

    if (!competition) {
      throw Exception.setError('این مسابقه موجودبب نمیباشد', true);
    }

    await competition.update({
      ...competition, //spread out existing task
      ...newCompetition, //spread out body - the differences in the body will over ride the task returned from DB.
    });

    return true;
  } catch (error) {
    log.error(error);
    throw Exception.setError(error, false);
  }
}

async function setmetaData(id, metaData) {
  try {
    log.info('-------id---------->' + id);
    log.info('-------metaData---------->' + metaData);
    const competition = await Competition.findByPk(id);

    if (!competition) {
      throw Exception.setError('این مسابقه موجود نمیباشد', true);
    }

    const newCompetition = {
      metaData: JSON.stringify(metaData),
    };

    log.info(
      '-------newCompetition---------->' + JSON.stringify(newCompetition)
    );

    await competition.update({
      ...competition, //spread out existing task
      ...newCompetition, //spread out body - the differences in the body will over ride the task returned from DB.
    });

    return true;
  } catch (error) {
    log.error(error);
    throw Exception.setError(error, false);
  }
}

async function destroy(id) {
  try {
    const competition = Competition.findByPk(id);

    if (!competition) {
      throw Exception.setError('این مسابقه وجود ندارد', false);
    }

    await competition.destroy();
    return true;
  } catch (error) {
    log.error(error);
    throw Exception.setError(error, false);
  }
}

module.exports = {
  index,
  getCompetitionWithCampainId,
  create,
  show,
  update,
  destroy,
  setmetaData,
};
