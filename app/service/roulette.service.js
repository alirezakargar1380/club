const _ = require('lodash');
const {
  Socket,
  Roulette,
  Ticket,
  Prize,
} = require('../models');
const moment = require('moment'); 
const { Op } = require('sequelize')
const Exception = require('../utils/error.utility');
const {
  console
} = require('../utils/log.utility');
const log = require('../utils/log.utility');
const prizeService = require('../service/prize.service')
const { prize } = require('../validations/validator.socket.prize.utility');



async function index() {
  try {
    const roulettes = await Roulette.findAll()

    return roulettes;
  } catch (error) {
    log.error(error);
    throw Exception.setError(error, false);
  }
}

async function create(roulette) {
  try {
    const rouletteObject = await Roulette.create({
      title: roulette.title,
      description: roulette.description,
      image: roulette.image,
      ticketPrice: roulette.ticketPrice,
      ticketPriceDiamond: roulette.ticketPriceDiamond,
      adPrice: roulette.adPrice,
      adPriceDiamond: roulette.adPriceDiamond,
      adPriceAfterWin: roulette.adPriceAfterWin,
      adPriceDiamondAfterWin: roulette.adPriceDiamondAfterWin,
      adPriceForDays: roulette.adPriceForDays,
      adPriceDiamondForDays: roulette.adPriceDiamondForDays,
      fromDate: roulette.fromDate,
      countDay: roulette.countDay
    });

    return true;
  } catch (error) {
    log.error(error);
    throw Exception.setError(error, false);
  }
}

async function show(id) {
  try {
    var roulette = await Roulette.findByPk(id)

    if (!roulette) {
      throw Exception.setError("این گردونه موجود نمیباشد", true);
    }

    return roulette;
  } catch (error) {
    log.error(error);
    throw Exception.setError(error, false);
  }
}

async function showRoulette(id) {
  try {
    var roulette = await Roulette.findByPk(id)

    if (!roulette) {
      throw Exception.setError("این گردونه موجود نمیباشد", true);
    }

    return roulette;
  } catch (error) {
    log.error(error);
    throw Exception.setError(error, false);
  }
}

async function update(id , newRoulette) {
  try{
  const roulette = await Roulette.findByPk(id)

  if (!roulette) {
    throw Exception.setError("این گردونه موجود نمیباشد", true);
  }

  await roulette.update({
    ...roulette, //spread out existing task
    ...newRoulette //spread out body - the differences in the body will over ride the task returned from DB.
  })

 
  return true;
} catch (error) {
  log.error(error);
  throw Exception.setError(error, false);
}
}

async function destroy(id) {
  try{
  const roulette = Roulette.findByPk(id)

  if (!roulette) {
    return res.status(400).json({
      message: 'Lottery Not Found'
    });
  }

  await roulette.destroy()
  
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
  destroy
}
exports.show = show;
exports.create = create;
exports.index = index;
exports.update = update;
exports.destroy = destroy;