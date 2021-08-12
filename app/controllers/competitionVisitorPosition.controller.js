const _ = require('lodash');
const {
  success,
  exception,
  error
} = require('../utils/response.utitlity')
const {
  Lottery,
  Setting
} = require('../models')
const competitionService = require('../service/competition.service')
const groupService = require('../service/group.service')
const validate  = require('../validations/validator.competition.visitor.position.utility')
const competitionVisitorPositionService = require('../service/competitionVisitorPosition.service')
const walletService = require('../service/wallet.service')

async function index(req, res) {
  try {
    const competitionMember = await competitionVisitorPositionService.index(req.params.competitionId)

    return success(res, competitionMember);
  } catch (error) {
    return exception(res, error.message);
  }
}

async function create(req, res) {
  try {

    req.body.userId = req.userId

    validate.create(req.body)

    const competitionVisitorPosition = await competitionVisitorPositionService.create(
      req.body
    )

    return success(res, competitionVisitorPosition)
  } catch (error) {
    return exception(res, error.message);
  }
}


async function show(req, res) {
  try {
    const competitionVisitorPosition = await competitionVisitorPositionService.show(req.params.id);

    return success(res, competitionVisitorPosition);
  } catch (error) {
    return exception(res, error.message);
  }
}

async function update(req, res) {
  try {

    const competitionVisitorPosition = await competitionVisitorPositionService.update(req.body.id , req.body.newCompetitionVisitorPosition);

    return success(res, competitionVisitorPosition);
  } catch (error) {
    return exception(res, error.message);
  }
}

async function destroy(req, res) {
  try {
    await competitionVisitorPositionService.destroy(req.params.id);

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
  destroy
}