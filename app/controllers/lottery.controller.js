const _ = require('lodash');
const { success, exception, error } = require('../utils/response.utitlity');
const log = require('../utils/log.utility');
const lotteryService = require('../service/lottery.service');
const Exception = require('../utils/error.utility');
const validate = require('../validations/validator.socket.lottery.utility');

async function index(req, res) {
  try {
    const lotteries = await lotteryService.index();

    return success(res, lotteries);
  } catch (error) {
    return exception(res, error.message);
  }
}

async function create(req, res) {
  try {
    if (!_.includes(['admin-club'], req.role))
      return error(res, 'کاربر معمولی نمیتواند قرعه کشی ثبت کند');

    validate.lottery(req.body);
    const result = await lotteryService.create(req.body);

    if (result) return success(res, result);
    else exception(res, result);
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

    const lottery = await lotteryService.show(req.params.id);

    return success(res, lottery);
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

    const lottery = await lotteryService.update(
      req.params.id,
      req.body.newLottery
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

    await lotteryService.destroy(req.params.id);

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
};
