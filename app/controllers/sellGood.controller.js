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
const sellGoodService = require('../service/sellGood.service')
const goodService = require('../service/good.service')
const settingService = require('../service/setting.service')
const validate = require('../service/sellGood.service');
const sellGood = require('../models/sellGood');
const setting = require('../models/setting');
const log = require('../utils/log.utility')

async function index(req, res) {
  try {
    const sellGood = await sellGoodService.index()

    return success(res, sellGood);
  } catch (error) {
    return exception(res, error.message);
  }
}


async function listSellGoodWithUserid(req, res) {
  try {
    if(!_.isEqual(req.role , 'admin-club'))
    return error(res , 'شما به این api دسترسی ندارید')

    const sellGood = await sellGoodService.listSellGoodWithUserid(req.userId)

    return success(res, sellGood);
  } catch (error) {
    return exception(res, error.message);
  }
}

async function returnCostAfterExpireTime(req, res) {
  try {

    const sellGood = await sellGoodService.returnCostAfterExpireTime(req.body.sellGoodId)

    return success(res, sellGood);
  } catch (error) {
    return exception(res, error.message);
  }
}

async function recieveGood(req, res) {
  try {

    await sellGoodService.recieveGood(req.body.sellGoodId)

    return success(res, []);
  } catch (error) {
    return exception(res, error.message);
  }
}

async function create(req, res) {
  try {

    log.info('-------sellGood----->' + JSON.stringify(req.body));
    req.body.userId = req.userId;
    validate.create(req.body)

    const good = await goodService.show(req.body.goodId)
    if (_.lt(good.count, req.body.count)) {
      error(res, 'این تعداد کالا موجود نمیباشد')

    } else if (_.isEqual(good.type, 1)) {
      error(res, 'این کالا برای فروش نمیباشد')
    } else {
      // sellGood.userId,
      // sellGood.goodId,
      // sellGood.count
      await sellGoodService.create(req.body)

      return success(res, sellGood)
    }
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

    const sellGood = await sellGoodService.show(req.params.id);

    return success(res, sellGood);
  } catch (error) {
    return exception(res, error.message);
  }
}

async function update(req, res) {
  try {
    const args = {
      id: req.params.id
    }

    validate.id(args)

    const sellGood = await sellGoodService.update(req.body.id, req.body.newSellGood);

    return success(res, sellGood);
  } catch (error) {
    return exception(res, error.message);
  }
}

async function destroy(req, res) {
  try {

    const args = {
      id: req.params.id
    }

    validate.id(args)

    await sellGoodService.destroy(req.params.id);

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
  listSellGoodWithUserid,
  returnCostAfterExpireTime,
  recieveGood
}