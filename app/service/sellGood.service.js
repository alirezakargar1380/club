const _ = require('lodash');
const {
  SellGood
} = require('../models');
const moment = require('moment');
const {
  Op
} = require('sequelize')
const Exception = require('../utils/error.utility');
const {
  console
} = require('../utils/log.utility');
const log = require('../utils/log.utility')
const walletService = require('../service/wallet.service')
const goodService = require('../service/good.service');
const {
  good
} = require('../validations/validator.good.utility');
const { sellGood } = require('../validations/validator.sellGood.utility');


async function index() {
  try {
    const sellGood = await SellGood.findAll({
      // where: {
      //   execute: false,
      // }
    })

    return sellGood;
  } catch (error) {
    log.error(error);
    throw Exception.setError(error, false);
  }
}

async function listSellGoodWithUserid(userId) {
  try {
    const sellGood = await SellGood.findAll({
      where: {
        userId: userId,
      }
    })

    return sellGood;
  } catch (error) {
    log.error(error);
    throw Exception.setError(error, false);
  }
}

async function recieveGood(sellGoodId) {
  try {

    await update(sellGoodId , {
      status : 2
    })

    return true;
  } catch (error) {
    log.error(error);
    throw Exception.setError(error, false);
  }
}

async function returnCostAfterExpireTime(sellGoodId) {
  try {
    const sellGood = await show(sellGoodId)
    await walletService.returnCostAfterExpireTime(sellGood.id , sellGood.goodId)

    await update(sellGoodId , {
      status : 3
    })

    return true;
  } catch (error) {
    log.error(error);
    throw Exception.setError(error, false);
  }
}

async function listSellGoodWithUseridForToday(userId) {
  try {
    const sellGood = await SellGood.findAll({
      where: {
        userId: userId,
        createdAt: {
          [Op.gte]: moment().subtract(7, 'days').toDate()
        },
      }
    })

    return sellGood;
  } catch (error) {
    log.error(error);
    throw Exception.setError(error, false);
  }
}

async function create(sellGood) {
  try {


    const good = await goodService.show(sellGood.goodId)

    if (_.lt(good.count, good))
      throw Exception.setError('این تعداد کالا وجود ندارد.', false);

    await walletService.buyGood(sellGood.goodId, sellGood.count, sellGood.userId)

    log.info('--------dd--------->' , JSON.stringify({
      count: good.count - sellGood.count
    }));
    await goodService.update(sellGood.goodId, {
      count: good.count - sellGood.count
    })

    await SellGood.create({
      userId: sellGood.userId,
      goodId: sellGood.goodId,
      count: sellGood.count
    })

    return true;
  } catch (error) {
    log.error(error);
    throw Exception.setError(error, false);
  }
}

async function show(id) {
  try {
    var sellGood = await SellGood.findByPk(id)

    if (!sellGood) {
      throw Exception.setError("این کالای فروخته شده موجود نمیباشد", true);
    }

    return sellGood;
  } catch (error) {
    log.error(error);
    throw Exception.setError(error, false);
  }
}

async function update(id, newSellGood) {
  try {
    const sellGood = await SellGood.findByPk(id)

    if (!sellGood) {
      throw Exception.setError("این کالای فروخته شده موجود نمیباشد", true);
    }

    await sellGood.update({
      ...sellGood, //spread out existing task
      ...newSellGood //spread out body - the differences in the body will over ride the task returned from DB.
    })


    return true;
  } catch (error) {
    log.error(error);
    throw Exception.setError(error, false);
  }
}

async function destroy(id) {
  try {
    const sellGood = SellGood.findByPk(id)

    if (!sellGood) {
      return res.status(400).json({
        message: 'SellGood Not Found'
      });
    }

    await sellGood.destroy()

    return true;
  } catch (error) {
    log.error(error);
    throw Exception.setError(error, false);
  }
}

module.exports = {
  index,
  create,
  show,
  update,
  destroy,
  listSellGoodWithUserid,
  listSellGoodWithUseridForToday,
  returnCostAfterExpireTime,
  recieveGood
}