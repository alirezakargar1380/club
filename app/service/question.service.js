const _ = require('lodash');
const {
  Question
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
    const winner = await Question.findAll({
      // where: {
      //   execute: false,
      // }
    })

    return winner;
  } catch (error) {
    log.error(error);
    throw Exception.setError(error, false);
  }
}

async function create(question) {
  try {
    if (_.isUndefined(question.userId))
      throw Exception.setError('شناسه کاربری الزامی است', false);

      if(!_.isNull(question.parentId))
      {
       let questionObject = await show(question.parentId)
       const newQuestion = {
         child : questionObject.child + 1
       }

       await update(questionObject.id , newQuestion)
      }


    const questionObject = await Question.create({
      like: 0,
      disLike: 0,
      type: question.type,
      userId: question.userId,
      parentId: question.parentId,
      child: 0,
      comment: question.comment,
      competitionId: question.competitionId,
      goodId: question.goodId,
    })

    return questionObject;



  } catch (error) {
    log.error(error);
    throw Exception.setError(error, false);
  }
}

async function show(id) {
  try {
    var question = await Question.findByPk(id)

    if (!question) {
      throw Exception.setError("این سوال موجودss نمیباشد", true);
    }

    return question;
  } catch (error) {
    log.error(error);
    throw Exception.setError(error, false);
  }
}

async function like(id) {
  try {
    const question = await Question.findByPk(id)

    if (!question) {
      throw Exception.setError("این سوال موجود نمیباشد", true);
    }

  const newQuestion = {
    like : question.like + 1
  }

    await question.update({
      ...question, //spread out existing task
      ...newQuestion //spread out body - the differences in the body will over ride the task returned from DB.
    })

    return true;
  } catch (error) {
    log.error(error);
    throw Exception.setError(error, false);
  }
}



async function disLike(id) {
  try {
    const question = await Question.findByPk(id)

    if (!question) {
      throw Exception.setError("این سوال موجود نمیباشد", true);
    }

  const newQuestion = {
    disLike : question.disLike + 1
  }

    await question.update({
      ...question, //spread out existing task
      ...newQuestion //spread out body - the differences in the body will over ride the task returned from DB.
    })

    return true;
  } catch (error) {
    log.error(error);
    throw Exception.setError(error, false);
  }
}

async function update(id, newQuestion) {
  try {
    const question = await Question.findByPk(id)

    if (!question) {
      throw Exception.setError("این سوال موجود نمیباشد", true);
    }

    await question.update({
      ...question, //spread out existing task
      ...newQuestion //spread out body - the differences in the body will over ride the task returned from DB.
    })

    return true;
  } catch (error) {
    log.error(error);
    throw Exception.setError(error, false);
  }
}

async function destroy(id) {
  try {
    const question = Question.findByPk(id)

    if (!question) {
      throw Exception.setError("این سوال وجود ندارد", false);
    }
    
    if(!_.isNull(question.parentId))
    {
     let questionObject = await show(question.parentId)
     const newQuestion = {
       child : questionObject.child - 1
     }

     await update(questionObject.id , newQuestion)
    }

    await question.destroy()
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
  like,
  disLike,
  update,
  destroy
}