const _ = require('lodash');
const {
  News
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
    const news = await News.findAll({
      // where: {
      //   count: {
      //     [Op.gt]: 0
      //   },
      // }
    })

    return news;
  } catch (error) {
    log.error(error);
    throw Exception.setError(error, false);
  }
}

async function create(news) {
  try {

    await News.create({
      userId: news.userId,
      title: news.title,
      description: news.description,
      image: news.image,
      competitionId: news.competitionId,
      type: 1
    })

    return true;
  } catch (error) {
    log.error(error);
    throw Exception.setError(error, false);
  }
}

async function show(id) {
  try {
    var news = await News.findByPk(id)

    if (!news) {
      throw Exception.setError("این خبر موجود نمیباشد", true);
    }

    return news;
  } catch (error) {
    log.error(error);
    throw Exception.setError(error, false);
  }
}

async function update(id, newNews) {
  try {
    const news = await News.findByPk(id)

    if (!news) {
      throw Exception.setError("این خبر موجود نمیباشد", true);
    }

    await news.update({
      ...news, //spread out existing task
      ...newNews //spread out body - the differences in the body will over ride the task returned from DB.
    })


    return true;
  } catch (error) {
    log.error(error);
    throw Exception.setError(error, false);
  }
}

async function destroy(id) {
  try {
    const news = News.findByPk(id)

    if (!news) {
      return res.status(400).json({
        message: 'Good Not Found'
      });
    }

    await news.destroy()

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
}