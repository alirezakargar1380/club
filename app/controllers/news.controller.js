const _ = require('lodash');
const {
  success,
  exception,
  error
} = require('../utils/response.utitlity')
const {
  Good,
  Setting
} = require('../models')
const newsService = require('../service/news.service')
const competitionService = require('../service/competition.service')
const validate = require('../validations/validator.news.utility')

async function index(req, res) {
  try {
    const news = await newsService.index()

    return success(res, news);
  } catch (error) {
    return exception(res, error.message);
  }
}

async function create(req, res) {
  try {

    req.body.userId = req.userId;
    req.body.type = 1;

    validate.create(req.body)

    // console.log('---===create========>', req.role);

    if (!_.includes(['admin-club', 'userAD-club'], req.role))
      return error(res, 'کاربر معمولی نمیتواند خبر ثبت کند')

    const competition = await competitionService.show(req.body.competitionId)
    // console.log('------competition----->', competition)
    if (_.isEmpty(competition))
      return error(res, 'این مسابقه وجود ندارد')

    const news = await newsService.create(
      req.body
    )

    return success(res, news)
  } catch (error) {
    return exception(res, error.message);
  }
}


async function show(req, res) {
  try {
    const args = {
      id: req.params.id
    }

    validate.id(args)

    const news = await newsService.show(req.params.id);

    return success(res, news);
  } catch (error) {
    return exception(res, error.message);
  }
}

async function update(req, res) {
  try {
// console.log('----req.body--------->',req.body);
    validate.id(req.body)

    const news = await newsService.update(req.body.id, req.body.newNews);

    return success(res, news);
  } catch (error) {
    return exception(res, error.message);
  }
}

async function destroy(req, res) {
  try {

    const args = {
      id: parseInt(req.params.id)
    }
    // console.log('--------args-------->', args)

    validate.id(args)

    await newsService.destroy(req.params.id);

    return success(res, {})

  } catch (error) {
    return exception(res, error.message);
  }

}

module.exports = {
  index,
  create,
  show,
  update,
  destroy
}