const _ = require('lodash');
const {
  success,
  exception,
  error
} = require('../utils/response.utitlity')
const {
  Question,
} = require('../models')
const questionService = require('../service/question.service')
const competitionService = require('../service/competition.service')
const goodService = require('../service/good.service')
const validate = require('../validations/validator.question.utility')

async function index(req, res) {
  try {
    const question = await questionService.index()

    return success(res, question);
  } catch (error) {
    return exception(res, error.message);
  }
}

async function create(req, res) {
  try {
// console.log('--------1------', req.body)
    req.body.userId = req.userId;

    validate.question(req.body)

    if (!_.includes([1,2] ,req.body.type)) 
    error(res, "نوع پرسش معتبر نمیباشد")

    if (_.isEqual(req.body.type, 1)) {
      if (_.isNull(req.body.competitionId))
        error(res, "شناسه مسابقه وجود ندارد")

      await competitionService.show(req.body.competitionId)
    }

    if (_.isEqual(req.body.type, 2)) {
      if (_.isNull(req.body.goodId))
      error(res , "شناسه کالا وجود ندارد")

      await goodService.show(req.body.goodId)
    }
    // console.log('--------2------', req.body)

    const question = await questionService.create(
      req.body
    )
    // console.log('--------3------')
    return success(res, question)
  } catch (error) {
    return exception(res, error.message);
  }
}


async function show(req, res) {
  try {
    const args ={
      id: req.params.id
    }

    validate.id(args)

    const question = await questionService.show(req.params.id);

    return success(res, question);
  } catch (error) {
    return exception(res, error.message);
  }
}

async function like(req, res) {
  try {

    const args ={
      id: req.body.id
    }

    validate.id(args)

    const question = await questionService.like(req.body.id);

    return success(res, question);
  } catch (error) {
    return exception(res, error.message);
  }
}

async function disLike(req, res) {
  try {

    const args ={
      id: req.body.id
    }

    validate.id(args)

    const question = await questionService.disLike(req.body.id);

    return success(res, question);
  } catch (error) {
    return exception(res, error.message);
  }
}

async function update(req, res) {
  try {



    if(!_.isEqual(req.role , 'admin-club'))
    return error(res , 'شما به این api دسترسی ندارید')

    const args ={
      id: req.body.id
    }

    validate.id(args)

    const question = await questionService.update(req.body.id , { 
      comment : req.body.comment,
      updatedBy : req.userId
    });

    return success(res, question);
  } catch (error) {
    return exception(res, error.message);
  }
}

async function destroy(req, res) {
  try {

    if(!_.isEqual(req.role , 'admin-club'))
    return error(res , 'شما به این api دسترسی ندارید')
    
    const args ={
      id: req.params.id
    }

    validate.id(args)

    await questionService.destroy(req.params.id);

    return success(res, {})

  } catch (error) {
    return exception(res, error.message);
  }

}

module.exports = {
  index,
  create,
  show,
  like,
  disLike,
  update,
  destroy
}