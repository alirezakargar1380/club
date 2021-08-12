const _ = require('lodash');
const {
  success,
  exception,
  error
} = require('../utils/response.utitlity')
const competitionService = require('../service/competition.service')
const walletService = require('../service/wallet.service')
const groupService = require('../service/group.service')
const validate  = require('../validations/validator.group.utility')
const {
  Lottery,
  Setting
} = require('../models');
const log = require('../utils/log.utility')

async function index(req, res) {
  try {
    const setting = await groupService.index()

    return success(res, setting);
  } catch (error) {
    return exception(res, error.message);
  }
}

async function create(req, res) {
  try {

    log.info('-------req.body-------->'+JSON.stringify(req.body))

    req.body.owner = req.userId;
    
    validate.create(req.body)

    log.info('-------after validate-------->'+JSON.stringify(req.body))
    const competition = await competitionService.show(req.body.competitionId)
    const groupsForCompetition = await groupService.showAllGroupsForCompetition(req.body.competitionId)
    // console.log('-------competition-------->',competition)
    // console.log('-------groupsForCompetition-------->',groupsForCompetition)
    if(_.isEqual(_.size(groupsForCompetition) , competition.countGroup))
    return error(res , 'ماکزیمم تعداد گروه برای این مسابقه تعریف شده است')


    if(!_.isEqual(competition.userId , req.userId))
    await walletService.ParticipationGroup(req.userId , competition.priceGroupForUser,competition.priceGroupDiamondForUser)
    
    const group = await groupService.create(
      req.body
    )

    return success(res, group)
  } catch (error) {
    return exception(res, error.message);
  }
}


async function show(req, res) {
  try {
    const group = await groupService.show(req.params.id);

    return success(res, group);
  } catch (error) {
    return exception(res, error.message);
  }
}


async function buyTicketForGroup(req, res) {
  try {
// console.log('----------buyTicketForGroup------.',req.params.id)
    
    const groupObject = await groupService.show(req.params.id);
    // console.log('----------groupObject------.',groupObject)
    if(!_.isNull(groupObject.userId))
    return error(res,"این تیکت فروخته شده است")

    const competition = await competitionService.show(groupObject.competitionId);
    // console.log('----------buyTicketForGroup---2---.')
    await walletService.Participation(req.userId, competition.priceForUser , competition.priceDiamondForUser)
    // console.log('----------buyTicketForGroup---3---.')
    const newGourp = await groupService.update(req.params.id , {
      ownerId: req.userId
    });

    return success(res, newGourp);
  } catch (error) {
    return exception(res, error.message);
  }
}

async function update(req, res) {
  try {
    const group = await groupService.update(req.body.id , req.body.newGroup);

    return success(res, group);
  } catch (error) {
    return exception(res, error.message);
  }
}

async function destroy(req, res) {
  try {
    await groupService.destroy(req.params.id);

    return success(res, {})

  } catch (error) {
    return exception(res, error.message);
  }

}

module.exports = {
  index,
  create,
  show,
  buyTicketForGroup,
  update,
  destroy
}