const _ = require('lodash');
const {
  success,
  exception,
  error
} = require('../utils/response.utitlity')
const validate = require('../validations/validator.prize.competition.utility')
const {
  Lottery,
  Setting
} = require('../models')
const competitionService = require('../service/competition.service')
const groupService = require('../service/group.service')
const goodService = require('../service/good.service')
const prizeService = require('../service/prize.service')
const goodForPrizeService = require('../service/goodForPrize.service')
const competitionMemberService = require('../service/competitionMember.service')
const walletService = require('../service/wallet.service')
const settingService = require('../service/setting.service');
const good = require('../models/good');
const {
  prize
} = require('../validations/validator.socket.prize.utility');

async function index(req, res) {
  try {
    const setting = await competitionService.index()

    return success(res, setting);
  } catch (error) {
    return exception(res, error.message);
  }
}

// req.body.competitionId
// req.body.expireDay
// req.body.order
// req.body.goodId
async function create(req, res) {
  try {

    // console.log('', req.body)
    req.body.userId = req.userId

    //validate input
    validate.create(req.body)

    // competittion
    const competition = await competitionService.show(req.body.competitionId)
    if (_.isEmpty(competition))
      return error(res, "این مسابقه وجود ندارد")

    // good
    const good = await goodService.show(req.body.goodId)
    if (_.isEmpty(good))
      return error(res, "این کالا وجود ندارد")

    const groupList = await groupService.showAllGroupsForCompetition(req.body.competitionId)

    if (!competition.prizeExist)
      return error(res, "این مسابقه دارای جایزه نمیباشد")


    for (const group of groupList) {
      const newPrize = await prizeService.create({
        grouoId: group.id,
        competitionId: req.body.competitionId,
        title: `در گروه شماره ${group.id} ${req.body.order}جایزه نفر `,
        description: '',
        image: '',
        multiOwnerPrize: false,
        userId: req.userId,
        order: req.body.order,
        category: 3,
        expireDay: req.body.expireDay
      })

      await goodForPrizeService.create({
        goodId: req.body.goodId,
        prizeId: newPrize.id,
        order: req.body.order,
      })
    }

    return success(res, competition)
  } catch (error) {
    return exception(res, error.message);
  }
}


module.exports = {
  index,
  create,

}