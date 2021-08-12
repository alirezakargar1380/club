const _ = require('lodash');
const { success, exception, error } = require('../utils/response.utitlity');
const { Good, Setting } = require('../models');
const goodService = require('../service/good.service');
const validate = require('../validations/validator.good.utility');

async function index(req, res) {
  try {
    let goods = [];
    if (!_.includes(['admin-club'], req.role))
      goods = await goodService.index();
    else goods = await goodService.ListGoodsWithUserId(req.userId);

    return success(res, goods);
  } catch (error) {
    return exception(res, error.message);
  }
}

async function create(req, res) {
  try {
    req.body.userId = req.userId;

    validate.good(req.body);

    // console.log('---===create========>',req.role);

    if (!_.includes(['admin-club', 'userAD-club'], req.role))
      return error(res, 'کاربر معمولی نمیتواند کالا ثبت کند');

    const good = await goodService.create(req.body);

    return success(res, good);
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

    const good = await goodService.show(req.params.id);

    return success(res, good);
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

    const good = await goodService.update(req.params.id, req.body.newGroup);

    return success(res, good);
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

    await goodService.destroy(req.params.id);

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
