const _ = require('lodash');
const {
  Report
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
const settingService = require('./setting.service')



async function index() {
  try {
    const report = await Report.findAll({
      // where: {
      //   execute: false,
      // }
    })

    return report;
  } catch (error) {
    log.error(error);
    throw Exception.setError(error, false);
  }
}

async function create(report) {
  try {
    log.info('---report-->'+JSON.stringify(report))
    if (_.isUndefined(report.userId))
      throw Exception.setError('شناسه کاربری الزامی است', false);


    const reportObject = await Report.create({
      type: report.type,
      comment: report.comment,
      userId: report.userId,
      commentId: report.commentId,
      questionId: report.questionId
    })

    return reportObject;



  } catch (error) {
    log.error(error);
    throw Exception.setError(error, false);
  }
}

async function show(id) {
  try {
    var report = await Report.findByPk(id)

    if (!report) {
      throw Exception.setError("این گزارش موجود نمیباشد", true);
    }

    return report;
  } catch (error) {
    log.error(error);
    throw Exception.setError(error, false);
  }
}

async function update(id, newReport) {
  try {
    const report = await Report.findByPk(id)

    if (!report) {
      throw Exception.setError("این گزارش موجود نمیباشد", true);
    }

    await report.update({
      ...report, //spread out existing task
      ...newReport //spread out body - the differences in the body will over ride the task returned from DB.
    })

    return true;
  } catch (error) {
    log.error(error);
    throw Exception.setError(error, false);
  }
}

async function destroy(id) {
  try {
    const report = Report.findByPk(id)

    if (!report) {
      throw Exception.setError("این گزارش وجود ندارد", false);
    }

    await report.destroy()
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