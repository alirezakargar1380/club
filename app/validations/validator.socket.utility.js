const Schema = require('validate');
const _ = require('lodash');
const log = require('../utils/log.utility');
const toString = require('../utils/to-string.utility');
const Exception = require('../utils/error.utility');

class Validate {
  constructor() {
    this.fields = {
      id: {
        type: String,
      },
      userId: {
        type: String,
      },
      socketId: {
        type: String,
      },
      lotteryId: {
        type: Number,
      },

    };
    this.errorMessages = {
      required: () => 'ERROR_MESSAGE_REQUIRED',
      validation: () => 'ERROR_MESSAGE_INVALID',
      type: () => 'ERROR_MESSAGE_WRONG_TYPE',
      length: () => 'ERROR_MESSAGE_INVALID_LENGTH',
    };
  }

  create(wallet, throwErrors = true) {
    const schema = new Schema({
      userId: _.assign({},
        this.fields.userId, {
          required: true
        },
      ),
      socketId: _.assign({},
        this.fields.socketId, {
          required: true
        },
      ),
      lotteryId: _.assign({},
        this.fields.lotteryId, {
          required: true
        },
      ),
    });

    schema.message(this.errorMessages);

    return this.constructor.sanitizeErrors(
      schema.validate(_.assign({}, wallet)),
      throwErrors,
    );
  }

  static sanitizeErrors(errors, throwErrors) {
    const errs = _.map(
      errors,
      error => ({
        [error.path]: error.message
      }),
    );
    // console.log('--------errs------>', errs);
    // console.log('--------throwErrors------>', throwErrors);
    if (_.size(errs)) {
      log.error(`Validation failed, ${toString(errs)}`);

      if (throwErrors) {
        throw Exception.setError(JSON.stringify(errs), throwErrors);
      }
    }
    return errs;
  }
}

module.exports = new Validate();