const _ = require('lodash');
const {
  Group
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
const competitionService = require('../service/competition.service')



async function index() {
  try {
    const group = await Group.findAll({
      // where: {
      //   execute: false,
      // }
    })

    return group;
  } catch (error) {
    log.error(error);
    throw Exception.setError(error, false);
  }
}

async function create(competition) {
  try {
    const groupObject = await Group.create({
      title: competition.title,
      description: competition.description,
      win: competition.win,
      competitor: competition.competitor,
      competitionId: competition.competitionId
    })

    return groupObject;
  } catch (error) {
    log.error(error);
    throw Exception.setError(error, false);
  }
}

async function showAllGroupsForCompetition(competitionId) {
  try {
    var groups = await Group.findAll({
      where: {
        competitionId: competitionId,
      }
    })

    if (!groups) {
      throw Exception.setError("این گروه موجود نمیباشد", true);
    }

    return groups;
  } catch (error) {
    log.error(error);
    throw Exception.setError(error, false);
  }
}

async function showWinGroupsForCompetition(competitionId) {
  try {
    var groups = await Group.findAll({
      where: {
        competitionId: competitionId,
        win : true
      }
    })

    if (!groups) {
      throw Exception.setError("این گروه موجود نمیباشد", true);
    }

    return groups;
  } catch (error) {
    log.error(error);
    throw Exception.setError(error, false);
  }
}

async function show(id) {
  try {
    var group = await Group.findByPk(id)

    if (!group) {
      throw Exception.setError("این گروه موجود نمیباشد", true);
    }

    return group;
  } catch (error) {
    log.error(error);
    throw Exception.setError(error, false);
  }
}

async function update(id, newGroup) {
  try {
    const group = await Group.findByPk(id)

    const competition = await competitionService.show(group.competitionId)

    if (!_.isUndefined(newGroup.win)) 
    if(!_.isEqual(competition.type , 2))
      throw Exception.setError("این مسابقه از نوع رقابت گروهی نیست", true);
    

    if (!group) {
      throw Exception.setError("این گروه موجود نمیباشد", true);
    }

    await group.update({
      ...group, //spread out existing task
      ...newGroup //spread out body - the differences in the body will over ride the task returned from DB.
    })


    return true;
  } catch (error) {
    log.error(error);
    throw Exception.setError(error, false);
  }
}

async function destroy(id) {
  try {
    const group = Group.findByPk(id)

    if (!group) {
      return res.status(400).json({
        message: 'Group Not Found'
      });
    }

    await group.destroy()

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
  showWinGroupsForCompetition,
  showAllGroupsForCompetition
}