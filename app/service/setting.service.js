const _ = require('lodash');
const {
  Socket,
  Lottery,
  Ticket,
  Prize,
  Setting
} = require('../models');
const Exception = require('../utils/error.utility');
const {
  console
} = require('../utils/log.utility');
const log = require('../utils/log.utility')



async function index() {
  try {
    const settings = await Setting.findAll()

    return settings;
  } catch (error) {
    log.error(error);
    throw Exception.setError(error, false);
  }
}

async function create(setting) {
  try {
    const settings = await Setting.findAll()
    if (_.size(settings))
      _.forEach(settings, async (setting) => {
        await setting.destroy()
      })


    await Setting.create(setting)

    return true;
  } catch (error) {
    log.error(error);
    throw Exception.setError(error, false);
  }
}

async function show(id) {
  try {
    var setting = await Setting.findByPk()

    if (!setting) {
      throw Exception.setError("این تنظیم موجود نمیباشد", true);
    }

    return true;
  } catch (error) {
    log.error(error);
    throw Exception.setError(error, false);
  }
}

async function update(id) {
  try {
    const setting = await Setting.findByPk(id)

    if (!setting) {
      throw Exception.setError("این تنظیم موجود نمیباشد", true);
    }

    await Setting.update({
      ...setting, //spread out existing task
      ...req.body //spread out body - the differences in the body will over ride the task returned from DB.
    })


    return true;
  } catch (error) {
    log.error(error);
    throw Exception.setError(error, false);
  }
}

async function destroy(id) {
  try {
    const setting = Setting.findByPk(id)

    if (!setting) {
      return res.status(400).json({
        message: 'Task Not Found'
      });
    }

    await setting.destroy()

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