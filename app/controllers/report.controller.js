const _ = require('lodash');
const {
  success,
  exception,
  error
} = require('../utils/response.utitlity')
const reportService = require('../service/report.service')
const commentService = require('../service/comment.service')
const questionService = require('../service/question.service')
const validate = require('../validations/validator.report.utility')

async function index(req, res) {
  try {
    const report = await reportService.index()

    return success(res, report);
  } catch (error) {
    return exception(res, error.message);
  }
}

async function create(req, res) {
  try {

    // console.log('-----req.body----->', req.body)
    req.body.userId = req.userId;

    validate.report(req.body)

    if (!_.includes([1,2] ,req.body.type)) 
    error(res, "نوع نظر معتبر نمیباشد")

    if (_.isEqual(req.body.type, 1)) {
      if (_.isNull(req.body.commentId))
        error(res, "شناسه نظر وجود ندارد")

     await commentService.show(req.body.commentId)
    }

    if (_.isEqual(req.body.type, 2)) {
      if (_.isNull(req.body.questionId))
        error(res, "شناسه پرسش وجود ندارد")

       await questionService.show(req.body.questionId)
    }

    const report = await reportService.create(
      req.body
    )

    return success(res, report)
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

    const report = await reportService.show(req.params.id);

    return success(res, report);
  } catch (error) {
    return exception(res, error.message);
  }
}

async function update(req, res) {
  try {

    if (!_.isEqual(req.role, 'admin-club'))
      return error(res, 'شما به این api دسترسی ندارید')

    const args = {
      id: req.body.id
    }

    validate.id(args)

    const report = await reportService.update(req.body.id,  { 
      comment : req.body.comment,
      updatedBy : req.userId
    });

    return success(res, report);
  } catch (error) {
    return exception(res, error.message);
  }
}

async function destroy(req, res) {
  try {
// console.log('----->', req.params);
    if (!_.isEqual(req.role, 'admin-club'))
      return error(res, 'شما به این api دسترسی ندارید')

    const args = {
      id: req.params.id
    }

    validate.id(args)

    await reportService.destroy(req.params.id);

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