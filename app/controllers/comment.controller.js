const _ = require('lodash');
const {
  success,
  exception,
  error
} = require('../utils/response.utitlity')
const {
  Comment,
} = require('../models')
const commentService = require('../service/comment.service')
const lotteryService = require('../service/lottery.service')
const rouletteService = require('../service/roulette.service')
const competitionService = require('../service/competition.service')
const goodService = require('../service/good.service')
const prizeService = require('../service/prize.service')
const validate = require('../validations/validator.comment.utility')

async function index(req, res) {
  try {
    const comment = await commentService.index()

    return success(res, comment);
  } catch (error) {
    return exception(res, error.message);
  }
}

async function create(req, res) {
  try {

    req.body.userId = req.userId;

    validate.comment(req.body)

    if (!_.includes([1, 2, 3, 4, 5], req.body.type))
      error(res, "نوع کامنت معتبر نمیباشد")

    if (_.isEqual(req.body.type, 1)) {
      if (_.isNull(req.body.lotteryId))
        error(res, "شناسه قرعه کشی وجود ندارد")

      await lotteryService.show(req.body.lotteryId)
    }

    if (_.isEqual(req.body.type, 2)) {
      if (_.isNull(req.body.rouletteId))
        error(res, "شناسه گردونه وجود ندارد")

      await rouletteService.show(req.body.rouletteId)
    }

    if (_.isEqual(req.body.type, 3)) {
      if (_.isNull(req.body.competitionId))
        error(res, "شناسه مسابقه وجود ندارد")

      await competitionService.show(req.body.competitionId)
    }

    if (_.isEqual(req.body.type, 4)) {
      if (_.isNull(req.body.goodId))
        error(res, "شناسه کالا وجود ندارد")

      await goodService.show(req.body.goodId)
    }

    if (_.isEqual(req.body.type, 5)) {
      if (_.isNull(req.body.prizeId))
        error(res, "شناسه جایزه وجود ندارد")

      await prizeService.show(req.body.prizeId)
    }

    const comment = await commentService.create(
      req.body
    )

    return success(res, comment)
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

    const comment = await commentService.show(req.params.id);

    return success(res, comment);
  } catch (error) {
    return exception(res, error.message);
  }
}

async function update(req, res) {
  try {

    if (!_.isEqual(req.role, 'admin-club'))
      return error(res, 'شما به این api دسترسی ندارید')

    const args = {
      id: req.body.id
    }

    validate.id(args)

    const comment = await commentService.update(req.body.id, { 
      comment : req.body.comment,
      updatedBy : req.userId
    });

    return success(res, comment);
  } catch (error) {
    return exception(res, error.message);
  }
}

async function destroy(req, res) {
  try {
// console.log('---req.params----->',req.params );
    if (!_.isEqual(req.role, 'admin-club'))
      return error(res, 'شما به این api دسترسی ندارید')

    await commentService.destroy(parseInt(req.params.id));

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