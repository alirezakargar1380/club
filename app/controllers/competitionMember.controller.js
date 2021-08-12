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
const validate  = require('../validations/validator.competition.member.utility')
const competitionMemberService = require('../service/competitionMember.service')
const walletService = require('../service/wallet.service')

async function index(req, res) {
  try {
    const competitionMember = await competitionMemberService.index()

    return success(res, competitionMember);
  } catch (error) {
    return exception(res, error.message);
  }
}

async function getTicketForCompetition(req, res) {
  try {
    // console.log('----------getTicketForCompetition------->',req.body.id)
    // console.log('----------getTicketForCompetition------->',req.query.id)
    // console.log('----------getTicketForCompetition------->',req.params.id)
    const competitionMember = await competitionMemberService.getTicketForCompetition(req.params.id)

    return success(res, competitionMember);
  } catch (error) {
    return exception(res, error.message);
  }
}

async function buyTicketForCompetition(req, res) {
  try {
    // console.log('----------getTicketForCompetition------->',req.body.id)
    // console.log('----------getTicketForCompetition------->',req.query.id)
    // console.log('----------getTicketForCompetition------->',req.params.id)
    
    const competitionMember = await competitionMemberService.getTicketForCompetition(req.params.id)
    await walletService.buyTicketForCompetition(competitionMember)

    await competitionMemberService.buyTicketForCompetition(req.params.id , req.userId , req.forUserId )

    return success(res, competitionMember);
  } catch (error) {
    return exception(res, error.message);
  }
}

async function create(req, res) {
  try {
    req.body.userId = req.userId

    validate.create(req.body)

    const group = await groupService.show(req.body.groupId)
    const competition = await groupService.show(group.competitionId)
    const competitionMemberList = await competitionMemberService.showMemberForGroup(req.body.groupId)

    if(_.isEqual(_.size(competitionMemberList),(competition.countMember / competition.countGroup)))
    {
      error(res , "برای این گروه ماکزیمم افراد اضافه شده است")
    }

    if(!_.isEqual(group.userId , req.userId))
    await walletService.Participation(req.userId  , competition.priceForUser,competition.priceDiamondForUser);

    const competitionMember = await competitionMemberService.create(
      req.body
    )

    return success(res, competitionMember)
  } catch (error) {
    return exception(res, error.message);
  }
}


async function show(req, res) {
  try {
    const competitionMember = await competitionMemberService.show(req.params.id);

    return success(res, competitionMember);
  } catch (error) {
    return exception(res, error.message);
  }
}

async function update(req, res) {
  try {
    if(!_.isEmpty(req.body.newCompetitionMember))
    if(_.isEqual(req.body.newCompetitionMember.win , true))
    {
      const competitionMember = await competitionMemberService.show(req.body.id);
      const wallet = await walletService.showWithUserId(competitionMember.userId);
      if (_.lt(wallet.coin, 0) || _.lt(wallet.diamond,  0))
      return error(res,"این شخص بدهی دارد و نمیتواند به عنوان برنده معرفی شود")
    }
    const competitionMember = await competitionMemberService.update(req.body.id , req.body.newCompetitionMember);

    return success(res, competitionMember);
  } catch (error) {
    return exception(res, error.message);
  }
}

async function destroy(req, res) {
  try {
    await competitionMemberService.destroy(req.params.id);

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
  getTicketForCompetition,
  buyTicketForCompetition
}