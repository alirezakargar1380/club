const _ = require('lodash');
const {
  CometitionMember
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
    const cometitionMember = await CometitionMember.findAll({
      // where: {
      //   execute: false,
      // }
    })

    return cometitionMember;
  } catch (error) {
    log.error(error);
    throw Exception.setError(error, false);
  }
}

async function getTicketForCompetition(competitionId) {
  try {
    const cometitionMember = await CometitionMember.findAll({
      where: {
        competitionId: competitionId,
        userId: null,
      }
    })

    return cometitionMember;
  } catch (error) {
    log.error(error);
    throw Exception.setError(error, false);
  }
}

async function create(cometitionMember) {
  try {
    await CometitionMember.create({
      userId: cometitionMember.userId,
      win: cometitionMember.win,
      groupId: cometitionMember.groupId,
      competitionId: cometitionMember.competitionId
    })

    return true;
  } catch (error) {
    log.error(error);
    throw Exception.setError(error, false);
  }
}

async function showMemberForGroup(groupId) {
  try {
    var cometitionMember = await CometitionMember.findAll({
      where: {
        groupId: groupId,
      }
    })

    if (!cometitionMember) {
      throw Exception.setError("این عضو موجود نمیباشد", true);
    }

    return cometitionMember;
  } catch (error) {
    log.error(error);
    throw Exception.setError(error, false);
  }
}


async function showWinMemberForGroup(groupId) {
  try {
    var cometitionMember = await CometitionMember.findAll({
      where: {
        groupId: groupId,
        win: true
      }
    })

    if (!cometitionMember) {
      throw Exception.setError("این عضو موجود نمیباشد", true);
    }

    return cometitionMember;
  } catch (error) {
    log.error(error);
    throw Exception.setError(error, false);
  }
}

async function showWinMemberForCompetition(competitionId) {
  try {


    const cometitionMemberList = await CometitionMember.findAll({
      where: {
        competitionId: competitionId,
        win: true
      }
    })

    if (_.isEqual(_.size(cometitionMemberList), 0)) {
      throw Exception.setError("این عضو موجود نمیباشد", true);
    }

    return cometitionMemberList;


  } catch (error) {
    log.error(error);
    throw Exception.setError(error, false);
  }
}

async function show(id) {
  try {
    var cometitionMember = await CometitionMember.findByPk(id)

    if (!cometitionMember) {
      throw Exception.setError("این عضو موجود نمیباشد", true);
    }

    return cometitionMember;
  } catch (error) {
    log.error(error);
    throw Exception.setError(error, false);
  }
}

async function buyTicketForCompetition(id, userId, forUserId) {
  try {
    log.info('-----update---------' + id)
    const competitionMember = await CometitionMember.findByPk(id)
    log.info('-----update----group-----' + JSON.stringify(competitionMember))
    const group = await groupService.show(competitionMember.groupId)
    log.info('-----update----group-----' + JSON.stringify(competitionMember))
    const competition = await competitionService.show(group.competitionId)

    if (!_.isEqual(competitionMember.userId, null)) {
      throw Exception.setError("این جایگاه قبلا فروخته شده است", true);
    }

    const newCompetition = {
      userId: userId
    }

    await competitionMember.update({
      ...competitionMember, //spread out existing task
      newCompetition //spread out body - the differences in the body will over ride the task returned from DB.
    })


    return true;
  } catch (error) {
    log.error(error);
    throw Exception.setError(error, false);
  }
}

async function update(id, newCompetitionMember) {
  try {
    log.info('-----update---------' + id)
    const competitionMember = await CometitionMember.findByPk(id)
    log.info('-----update----group-----' + JSON.stringify(competitionMember))
    const group = await groupService.show(competitionMember.groupId)
    log.info('-----update----group-----' + JSON.stringify(competitionMember))
    const competition = await competitionService.show(group.competitionId)

    const winnerMember = await showWinMemberForGroup(competitionMember.groupId)
    log.info('-----update---1------')
    if (!competitionMember) {
      throw Exception.setError("این عضو موجود نمیباشد", true);
    }

    if (!_.isUndefined(newCompetitionMember.win))
      if (_.lte(competition.countWinner, _.size(winnerMember))) {
        throw Exception.setError("تعداد برنده شدگان بیش از حد تعیید شده میباشد.", true);
      }

    await competitionMember.update({
      ...competitionMember, //spread out existing task
      ...newCompetitionMember //spread out body - the differences in the body will over ride the task returned from DB.
    })


    return true;
  } catch (error) {
    log.error(error);
    throw Exception.setError(error, false);
  }
}

async function destroy(id) {
  try {
    const cometitionMember = CometitionMember.findByPk(id)

    if (!cometitionMember) {
      return res.status(400).json({
        message: 'CometitionMember Not Found'
      });
    }

    await cometitionMember.destroy()

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
  buyTicketForCompetition,
  showWinMemberForGroup,
  showWinMemberForCompetition,
  showMemberForGroup,
  getTicketForCompetition
}