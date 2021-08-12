const _ = require('lodash');
const {
  GoodForPrize
} = require('../models');
const moment = require('moment');
const {
  Op
} = require('sequelize')
const Exception = require('../utils/error.utility');
const {
  console
} = require('../utils/log.utility');
const log = require('../utils/log.utility');



async function index() {
  try {
    const goodForPrize = await GoodForPrize.findAll({
      // where: {
      //   execute: false,
      // }
    })

    return goodForPrize;
  } catch (error) {
    log.error(error);
    throw Exception.setError(error, false);
  }
}

async function checkExist(prizeId, goodId , userId) {
  try {
    const goodForPrize = await GoodForPrize.findAll({
      where: {
        prizeId: prizeId,
        userId: userId,
        goodId: goodId,
      }
    })

    return goodForPrize;
  } catch (error) {
    log.error(error);
    throw Exception.setError(error, false);
  }
}


async function listGoodForPrizeWithUserid(prizeId , userId) {
  try {
    const goodForPrize = await GoodForPrize.findAll({
      where: {
        prizeId: prizeId,
        userId: userId
      }
    })

    return goodForPrize;
  } catch (error) {
    log.error(error);
    throw Exception.setError(error, false);
  }
}


async function listGoodForPrize(prizeId) {
  try {
    const goodForPrize = await GoodForPrize.findAll({
      where: {
        prizeId: prizeId
      }
    })

    return goodForPrize;
  } catch (error) {
    log.error(error);
    throw Exception.setError(error, false);
  }
}

async function goodForPrizeWithOrder(prizeId , order) {
  try {
    const goodForPrize = await GoodForPrize.findOne({
      where: {
        prizeId: prizeId,
        order: order
      }
    })

    return goodForPrize;
  } catch (error) {
    log.error(error);
    throw Exception.setError(error, false);
  }
}

async function listGoodForUserid( userId) {
  try {
    const goodForPrize = await GoodForPrize.findAll({
      where: {
        userId: userId
      }
    })

    return goodForPrize;
  } catch (error) {
    log.error(error);
    throw Exception.setError(error, false);
  }
}

async function create(good) {
  try {

    const goodObject =await GoodForPrize.create({
      userId: good.userId,
      goodId: good.goodId,
      prizeId: good.prizeId,
      order: good.order,
    })

    return goodObject;
  } catch (error) {
    log.error(error);
    throw Exception.setError(error, false);
  }
}

async function show(id) {
  try {
    var goodForPrize = await GoodForPrize.findByPk(id)

    if (!goodForPrize) {
      throw Exception.setError("این کالای جایزه موجود نمیباشد", true);
    }

    return goodForPrize;
  } catch (error) {
    log.error(error);
    throw Exception.setError(error, false);
  }
}

async function update(id, newGoodForPrize) {
  try {
    const goodForPrize = await GoodForPrize.findByPk(id)

    if (!goodForPrize) {
      throw Exception.setError("این کالای موجود نمیباشد", true);
    }

    await goodForPrize.update({
      ...goodForPrize, //spread out existing task
      ...newGoodForPrize //spread out body - the differences in the body will over ride the task returned from DB.
    })


    return true;
  } catch (error) {
    log.error(error);
    throw Exception.setError(error, false);
  }
}

async function destroy(id) {
  try {
    const goodForPrize = GoodForPrize.findByPk(id)

    if (!goodForPrize) {
      return res.status(400).json({
        message: 'GoodForPrize Not Found'
      });
    }

    await goodForPrize.destroy()

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
  listGoodForPrizeWithUserid,
  listGoodForUserid,
  listGoodForPrize,
  goodForPrizeWithOrder,
  checkExist
}