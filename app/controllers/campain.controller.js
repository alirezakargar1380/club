const _ = require('lodash');
const {
  success,
  exception,
  error
} = require('../utils/response.utitlity')
const validate = require('../validations/validator.campain.utility')
const {
  Lottery,
  Setting
} = require('../models')
const campainService = require('../service/campain.service')
const groupService = require('../service/group.service')
const competitionMemberService = require('../service/competitionMember.service')
const walletService = require('../service/wallet.service')
const settingService = require('../service/setting.service')

async function index(req, res) {
  try {
    const campain = await campainService.index()

    return success(res, campain);
  } catch (error) {
    return exception(res, error.message);
  }
}

async function create(req, res) {
  try {

    req.body.userId = req.userId

    validate.create(req.body)
    
    const campain = await campainService.create(
      req.body
    )

    return success(res, campain)
  } catch (error) {
    return exception(res, error.message);
  }
}


async function show(req, res) {
  try {
    const campain = await campainService.show(req.params.id);

    return success(res, campain);
  } catch (error) {
    return exception(res, error.message);
  }
}

async function update(req, res) {
  try {
    const campain = await campainService.update(req.body.id, req.body.newCampain);

    return success(res, campain);
  } catch (error) {
    return exception(res, error.message);
  }
}

async function destroy(req, res) {
  try {
    // console.log('-----------')
    await campainService.destroy(req.params.id);
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
  destroy
}