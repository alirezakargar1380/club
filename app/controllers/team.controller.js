const _ = require('lodash');
const {
  success,
  exception,
  error
} = require('../utils/response.utitlity')
const validate = require('../validations/validator.team.utility')
const {
  Lottery,
  Setting
} = require('../models')
const teamService = require('../service/team.service')
const groupService = require('../service/group.service')
const competitionMemberService = require('../service/competitionMember.service')
const walletService = require('../service/wallet.service')
const settingService = require('../service/setting.service')

async function index(req, res) {
  try {
    const team = await teamService.index()

    return success(res, team);
  } catch (error) {
    return exception(res, error.message);
  }
}

async function listUserTeam(req, res) {
  try {
    const team = await teamService.listUserTeam(req.userId)

    return success(res, team);
  } catch (error) {
    return exception(res, error.message);
  }
}

async function create(req, res) {
  try {

    req.body.userId = req.userId

    validate.create(req.body)
    
    const team = await teamService.create(
      req.body
    )

    return success(res, team)
  } catch (error) {
    return exception(res, error.message);
  }
}


async function show(req, res) {
  try {
    const team = await teamService.show(req.params.id);

    return success(res, team);
  } catch (error) {
    return exception(res, error.message);
  }
}

async function update(req, res) {
  try {
    const team = await teamService.update(req.body.id, req.body.newTeam);

    return success(res, team);
  } catch (error) {
    return exception(res, error.message);
  }
}

async function destroy(req, res) {
  try {
    // console.log('-----------')
    await teamService.destroy(req.params.id);
    // console.log('------2----')
    return success(res, {})

  } catch (error) {
    return exception(res, error.message);
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