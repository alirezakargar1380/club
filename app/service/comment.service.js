const _ = require('lodash');
const {
  Comment
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
    const comment = await Comment.findAll({
      // where: {
      //   execute: false,
      // }
    })

    return comment;
  } catch (error) {
    log.error(error);
    throw Exception.setError(error, false);
  }
}

async function create(comment) {
    try {
      if (_.isUndefined(comment.userId))
        throw Exception.setError('شناسه کاربری الزامی است', false);

  
          const commentObject = await Comment.create(comment)

          return commentObject;
        


      }
      catch (error) {
        log.error(error);
        throw Exception.setError(error, false);
      }
    }

    async function show(id) {
      try {
        var newComment = await Comment.findByPk(id)

        if (!newComment) {
          throw Exception.setError("این نظر موجود نمیباشد", true);
        }

        return newComment;
      } catch (error) {
        log.error(error);
        throw Exception.setError(error, false);
      }
    }

    async function update(id, newComment) {
      try {
        const comment = await Comment.findByPk(id)

        if (!comment) {
          throw Exception.setError("این نظر موجود نمیباشد", true);
        }

        await comment.update({
          ...comment, //spread out existing task
          ...newComment //spread out body - the differences in the body will over ride the task returned from DB.
        })

        return true;
      } catch (error) {
        log.error(error);
        throw Exception.setError(error, false);
      }
    }

    async function destroy(id) {
      try {
        const comment = Comment.findByPk(id)

        if (!comment) {
          throw Exception.setError("این نظر وجود ندارد", false);
        }

        await comment.destroy()
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