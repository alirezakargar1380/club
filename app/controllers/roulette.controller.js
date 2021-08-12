const _ = require('lodash');
const { success, exception, error } = require('../utils/response.utitlity');
const log = require('../utils/log.utility');
const rouletteService = require('../service/roulette.service');
const Exception = require('../utils/error.utility');
const validate = require('../validations/validator.socket.roulette.utility');
const rouletteThread = require('../service/roulette.thread.service');
const ticketService = require('../service/ticket.service');

async function index(req, res) {
  try {
    const roulettes = await rouletteService.index();

    return success(res, roulettes);
  } catch (error) {
    return exception(res, error.message);
  }
}

async function create(req, res) {
  try {
    if (!_.includes(['admin-club'], req.role))
      return error(res, 'کاربر معمولی نمیتواند قرعه کشی ثبت کند');

    validate.lottery(req.body);
    const result = await rouletteService.create(req.body);

    if (result) return success(res, result);
    else exception(res, result);
  } catch (error) {
    return exception(res, error.message);
  }
}

async function run(req, res) {
  try {
    // console.log('----data-------->', data)
    const ticket = await ticketService.show(req.body.ticketId);
    // console.log('----ticket-------->', ticket)
    // console.log('----data-------->', data)
    if (_.isEqual(ticket.dataValues.used, true))
      throw Exception.setError(`این بلیط استفاده شده است`, true);

    // data.rouletteId,
    // data.ticketId,
    await rouletteThread.run(req.body.rouletteId, req.body.ticketId);

    const tickets = await ticketService.getListTicketWithRouletteId(
      req.body.rouletteId
    );
    const userTickets = await ticketService.getListTicketWithRouletteIdAndUserId(
      req.body.rouletteId,
      req.userId
    );

    //set for owner
    if (_.isEqual(req.role, 'admin-club')) success(res, tickets);
    else success(res, userTickets);
    // console.log('---roulette-----4------');
    // socket.broadcast.emit('getRouletteTickets', tickets);
    // io.to(socketId).emit('getRouletteTickets', socketSuccess(tickets));
  } catch (error) {
    return exception(res, error.message);
  }
}

async function show(req, res) {
  try {
    const args = {
      id: req.params.id,
    };

    validate.id(args);

    const roulette = await rouletteService.show(req.params.id);

    return success(res, roulette);
  } catch (error) {
    return exception(res, error.message);
  }
}

async function update(req, res) {
  try {
    const args = {
      id: req.params.id,
    };

    validate.id(args);

    const lottery = await rouletteService.update(
      req.params.id,
      req.body.newRoulette
    );

    return success(res, lottery);
  } catch (error) {
    return exception(res, error.message);
  }
}

async function destroy(req, res) {
  try {
    const args = {
      id: req.params.id,
    };

    validate.id(args);

    await rouletteService.destroy(req.params.id);

    return success(res, {});
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
  run,
};
