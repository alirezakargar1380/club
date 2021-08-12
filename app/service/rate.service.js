const _ = require('lodash');
const {
  Rate
} = require('../models');
const moment = require('moment');
const {
  Op
} = require('sequelize')
const Exception = require('../utils/error.utility');
const goodService = require('../service/good.service')
const {
  console
} = require('../utils/log.utility');
const log = require('../utils/log.utility');
const {
  good
} = require('../validations/validator.good.utility');



async function index() {
  try {
    const rate = await Rate.findAll({
      // where: {
      //   count: {
      //     [Op.gt]: 0
      //   },
      // }
    })

    return rate;
  } catch (error) {
    log.error(error);
    throw Exception.setError(error, false);
  }
}

async function getRateForGood(goodId) {
  try {
    const rate = await Rate.findAll({
      where: {
        goodId: goodId
      }
    })

    return rate;
  } catch (error) {
    log.error(error);
    throw Exception.setError(error, false);
  }
}

async function create(rate) {
  try {

    const good = await goodService.show(rate.goodId)
    const listRate = await getRateForGood(good.id)

    let index = 0;
    let totalRate = 0;
    for (const rateItem of listRate) {
      index++;
      totalRate = totalRate + rateItem.rate;
    }
    totalRate = totalRate + rate.rate;

    await goodService.update(good.id , {
      rate : Math.ceil(totalRate/inde+1)
    })

    await Rate.create({
      userId: rate.userId,
      goodId: rate.goodId,
      rate: rate.rate,
    })

    return true;
  } catch (error) {
    log.error(error);
    throw Exception.setError(error, false);
  }
}

async function show(id) {
  try {
    var rate = await Rate.findByPk(id)

    if (!rate) {
      throw Exception.setError("این کالا موجود نمیباشد", true);
    }

    return rate;
  } catch (error) {
    log.error(error);
    throw Exception.setError(error, false);
  }
}

async function update(id, newRate) {
  try {
    const rate = await Rate.findByPk(id)

    if (!rate) {
      throw Exception.setError("این کالا موجود نمیباشد", true);
    }

    await rate.update({
      ...rate, //spread out existing task
      ...newRate //spread out body - the differences in the body will over ride the task returned from DB.
    })


    return true;
  } catch (error) {
    log.error(error);
    throw Exception.setError(error, false);
  }
}

async function destroy(id) {
  try {
    const rate = Rate.findByPk(id)

    if (!rate) {
      return res.status(400).json({
        message: 'Good Not Found'
      });
    }

    await rate.destroy()

    return true;
  } catch (error) {
    log.error(error);
    throw Exception.setError(error, false);
  }
}

module.exports = {
  index,
  getRateForGood,
  create,
  show,
  update,
  destroy,
}