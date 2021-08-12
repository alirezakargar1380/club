const _ = require('lodash');
const {
  success,
  exception,
  error
} = require('../utils/response.utitlity')
const {
  Good,
  Setting
} = require('../models')
const goodForPrizeService = require('../service/goodForPrize.service')
const goodService = require('../service/good.service')
const prizeService = require('../service/prize.service')
const validate = require('../validations/validator.goodForPrize.utility')

async function index(req, res) {
  try {
    const goodForPrize = await goodForPrizeService.listGoodForPrize(req.params.id)

    return success(res, goodForPrize);
  } catch (error) {
    return exception(res, error.message);
  }
}

async function create(req, res) {
  try {
    // console.log('-----req.body------->', req.body)
    // console.log('-----req.userId------->', req.userId)
    // console.log('-----req.role------->', req.role)

    req.body.userId = req.userId;
    validate.create(req.body)

    const good = await goodService.show(req.body.goodId)
    const existGood = await goodForPrizeService.checkExist(req.body.prizeId, req.body.goodId, req.body.userId)
    const prize = await prizeService.show(req.body.prizeId)
    // console.log('----good----userId---->', good.dataValues.userId)
    // console.log('----req.body.userId-------->', req.body.userId)

    if (_.includes([2, 3], prize.statusPay))
      error(res, "قرعه کشی مربوطه انجام شده است")

    if (!_.isEmpty(existGood))
      error(res, "این مورد قبلا ثبت شده است")

    if (!_.isEqual(good.dataValues.userId, req.body.userId))
      error(res, "این کالا به این کاربر تعلق ندارد")

    if (!_.isEqual(prize.dataValues.userId, req.body.userId))
      error(res, "این جایزه به این کاربر تعلق ندارد")

    const listGoodForPrize = await goodForPrizeService.listGoodForPrize(req.body.prizeId)
    let listGoodeForPrize = [];
    for (let index = 0; index < good.count;index++) {
      req.body.order = index;
      
      const goodForPrize = await goodForPrizeService.create(
        req.body
      )

      listGoodeForPrize.push(goodForPrize)
    }

    return success(res, listGoodeForPrize)
  } catch (error) {
    return exception(res, error.message);
  }
}

async function listGoodForPrizeWithUserid(req, res) {
  try {

    const goodForPrize = await goodForPrizeService.listGoodForPrizeWithUserid(req.params.prizeId, req.params.userId);

    return success(res, goodForPrize);
  } catch (error) {
    return exception(res, error.message);
  }
}

async function show(req, res) {
  try {
    const args = {
      id: req.params.id
    }

    validate.id(args)

    const goodForPrize = await goodForPrizeService.show(req.params.id);

    return success(res, goodForPrize);
  } catch (error) {
    return exception(res, error.message);
  }
}

async function executeCode(req, res) {
  try {

    const args = {
      id: req.body.code
    }

    validate.id(args)

    const goodForPrize = await goodForPrizeService.update(req.body.id, req.body.newGroup);

    return success(res, goodForPrize);
  } catch (error) {
    return exception(res, error.message);
  }
}

async function update(req, res) {
  try {

    const args = {
      id: req.body.id
    }

    validate.id(args)

    const goodForPrize = await goodForPrizeService.update(req.body.id, req.body.newGroup);

    return success(res, goodForPrize);
  } catch (error) {
    return exception(res, error.message);
  }
}

async function destroy(req, res) {
  try {

    const args = {
      id: req.params.id
    }

    validate.id(args);
    const good = await show(args.id);
    const prize = await prizeService.show(good.prizeId);

    if (_.isEqual(prize.statusPay, 2))
      error(res, "این جایزه در قرعه کشی استفاده شده است")

    await goodForPrizeService.destroy(req.params.id);

    return success(res, {})

  } catch (error) {
    return exception(res, error.message);
  }

}

module.exports = {
  index,
  create,
  listGoodForPrizeWithUserid,
  show,
  update,
  destroy
}