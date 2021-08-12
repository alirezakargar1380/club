const _ = require('lodash');
const {
  success,
  exception,
  error
} = require('../utils/response.utitlity')
const validate = require('../validations/validator.competition.utility')
const {
  Lottery,
  Setting
} = require('../models')
const competitionService = require('../service/competition.service')
const groupService = require('../service/group.service')
const competitionMemberService = require('../service/competitionMember.service')
const walletService = require('../service/wallet.service')
const settingService = require('../service/setting.service')

async function index(req, res) {
  try {
    const competition = await competitionService.index()

    return success(res, competition);
  } catch (error) {
    return exception(res, error.message);
  }
}

async function getCompetitionWithCampainId(req, res) {
  try {
    const competition = await competitionService.getCompetitionWithCampainId(req.params.campainId)

    return success(res, competition);
  } catch (error) {
    return exception(res, error.message);
  }
}

async function create(req, res) {
  try {

    // console.log('', req.body)
    req.body.userId = req.userId

    //validate input
    validate.create(req.body)

    // competittion type 0
    if (_.isEqual(req.body.type, 0) && _.gt(req.body.countGroup, 1))
      return error(res, "برای این نوع مسابقه نمیتوان بیش از یک گروه داشت")

    // competittion type 1
    const countMember = req.body.countMember / req.body.countGroup
    if (_.isEqual(req.body.type, 1) && _.gt(countMember, 2))
      return error(res, "برای این نوع مسابقه نمیتوان بیش از دو عضو برای هر گروه داشت")

    if (_.isEqual(req.body.type, 1) && !_.isInteger(req.body.countGroup / 2))
      return error(res, "تعداد گروه ها باید زوج باشند")

    if (_.isEqual(req.body.type, 1) && !_.isInteger(countMember))
      return error(res, "این تعداد کاربر به صورت مساوی قابل تقسیم به این تعداد گروه نمیباشد")

    // competittion type 2
    if (_.isEqual(req.body.type, 2) && !_.isInteger(req.body.countGroup / 2))
      return error(res, "تعداد گروه ها باید زوج باشند")
    if (_.isEqual(req.body.type, 2) && !_.isInteger(countMember))
      return error(res, "این تعداد کاربر به صورت مساوی قابل تقسیم به این تعداد گروه نمیباشد")

    // competittion type 3
    if (_.isEqual(req.body.type, 3) && !_.isInteger(req.body.countGroup / 2))
      return error(res, "تعداد گروه ها باید زوج باشند")
    if (_.isEqual(req.body.type, 3) && !_.isInteger(countMember))
      return error(res, "این تعداد کاربر به صورت مساوی قابل تقسیم به این تعداد گروه نمیباشد")

    // decrease price for create competition
    const setting = await settingService.index();

    // console.log('-------0---------->', setting[0].priceForCreateCompetition)
    // console.log('-------0---------->', setting[0].priceForCreateCompetition)
    await walletService.createCompetition(req.userId, setting[0].priceForCreateCompetition, setting[0].priceDiamondForCreateCompetition)


    // console.log('-------1----------->')
    req.body.image = req.image;
    const competition = await competitionService.create(
      req.body
    )

    console.log('------2----------->')
    let listGroup = [];
    for (var indexGroup = 0; indexGroup < competition.countGroup; indexGroup++) {
      const group = await groupService.create({
        "title": competition.title + " گروه " + indexGroup,
        "description": "",
        "competitionId": competition.id
      })
      listGroup.push(group.id)
      // create member
      for (var indexMember = 0; indexMember < countMember; indexMember++) {
        await competitionMemberService.create({
          "groupId": group.id,
          "competitionId": competition.id
        })
      }
    }
    console.log('----listGroup------->', listGroup);
    if (_.isEqual(req.body.type, 2)) {
      let tempListGroup = _.clone(_.reverse(listGroup), true);
      listGroup.forEach(async (groupId, index) => {
        await groupService.update(groupId, {
          competitor: tempListGroup.pop()
        })
      });
    }


    return success(res, competition)
  } catch (error) {
    return exception(res, error.message);
  }
}


async function createNextLevel(req, res) {
  try {
    // console.log('---createNextLevel---1------>' + req.body.oldCompetitionId)
    const winMembers = await competitionMemberService.showWinMemberForCompetition(req.body.oldCompetitionId)
    // console.log('---winMembers---12------>' + JSON.stringify(winMembers))
    if (!_.isInteger(_.size(winMembers) / req.body.countGroup))
      return error(res, 'تعداد افراد به این تعداد گروه قابل تقسیم نیست')
    // console.log('---createNextLevel---2------>')
    req.body.userId = req.userId
    // console.log('------create----req.body------>', req.body);
    validate.create(req.body)
    // console.log('------create----req.body--1---->', req.body);
    const competition = await competitionService.create(
      req.body
    )
    // console.log('------create----competition---->', competition);
    // create groups
    let groupArray = [];
    for (var indexGroup = 0; indexGroup < competition.countGroup; indexGroup++) {
      const group = await groupService.create({
        "title": competition.title + " گروه " + indexGroup,
        "description": "",
        "competitionId": competition.id
      })

      groupArray.push(group.id)
    }



    // create member
    let countGroupMember = 0
    let indexGroupMember = 0
    for (var indexMember = 0; indexMember < _.size(winMembers); indexMember++) {
      if (_.isEqual(countGroupMember, groupArray / _.size(groupArray))) {
        countGroupMember = 0;
        indexGroupMember++;
      }

      await competitionMemberService.create({
        "userId": winMembers[indexMember].userId,
        "groupId": groupArray[indexGroupMember],
        "win": false,
        "competitionId": competition.id
      })
      countGroupMember++;
    }

    return success(res, competition)
  } catch (error) {
    return exception(res, error.message);
  }
}


async function show(req, res) {
  try {
    const competition = await competitionService.show(req.params.id);

    return success(res, competition);
  } catch (error) {
    return exception(res, error.message);
  }
}

async function update(req, res) {
  try {
    const competition = await competitionService.update(req.body.id, req.body.newCompetition);

    return success(res, competition);
  } catch (error) {
    return exception(res, error.message);
  }
}


async function setmetaData(req, res) {
  try {
    const competition = await competitionService.setmetaData(req.body.id, req.body.metaData);

    return success(res, competition);
  } catch (error) {
    return exception(res, error.message);
  }
}

async function destroy(req, res) {
  try {
    // console.log('-----------')
    await competitionService.destroy(req.params.id);
    // console.log('------2----')
    return success(res, {})

  } catch (error) {
    return exception(res, error.message);
  }

}

module.exports = {
  index,
  getCompetitionWithCampainId,
  createNextLevel,
  create,
  setmetaData,
  show,
  update,
  destroy
}