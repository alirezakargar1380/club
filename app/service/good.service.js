const _ = require('lodash');
const {
  Good
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



async function index() {
  try {
    const good = await Good.findAll({
      where: {
        count: {
          [Op.gt]: 0
        },
      }
    })

    return good;
  } catch (error) {
    log.error(error);
    throw Exception.setError(error, false);
  }
}

async function ListGoodsWithUserId(userId) {
  try {
    const good = await Good.findAll({
      where: {  
        userId: userId,
      }
    })

    return good;
  } catch (error) {
    log.error(error);
    throw Exception.setError(error, false);
  }
}

async function create(good) {
  try {

    await Good.create({
      userId: good.userId,
      title: good.title,
      description: good.description,
      image: good.image,
      price:  good.price,
      priceDiamond:  good.priceDiamond,
      priceOfToman: good.priceOfToman,
      count:  good.count,
      type: good.type,
      expireDay: good.expireDay
    })

    return true;
  } catch (error) {
    log.error(error);
    throw Exception.setError(error, false);
  }
}

async function show(id) {
  try {
    var good = await Good.findByPk(id)

    if (!good) {
      throw Exception.setError("این کالا موجود نمیباشد", true);
    }

    return good;
  } catch (error) {
    log.error(error);
    throw Exception.setError(error, false);
  }
}

async function update(id, newGood) {
  try {
    const good = await Good.findByPk(id)

    if (!good) {
      throw Exception.setError("این کالا موجود نمیباشد", true);
    }

    await good.update({
      ...good, //spread out existing task
      ...newGood //spread out body - the differences in the body will over ride the task returned from DB.
    })


    return true;
  } catch (error) {
    log.error(error);
    throw Exception.setError(error, false);
  }
}

async function destroy(id) {
  try {
    const good = Good.findByPk(id)

    if (!good) {
      return res.status(400).json({
        message: 'Good Not Found'
      });
    }

    await good.destroy()

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
  ListGoodsWithUserId
}