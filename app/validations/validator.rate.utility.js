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
      rate: {
        type: Number,
        length: { min: 1, max: 5 }
      },
      goodId: {
        type: Number,
      },
      userId: {
        type: String,
      },

    };
    this.errorMessages = {
      required: () => 'ERROR_MESSAGE_REQUIRED',
      validation: () => 'ERROR_MESSAGE_INVALID',
      type: () => 'ERROR_MESSAGE_WRONG_TYPE',
      length: () => 'ERROR_MESSAGE_INVALID_LENGTH',
    };
  }

  create(rate, throwErrors = true) {
    const schema = new Schema({
      goodId: _.assign({},
        this.fields.goodId, {
          required: true
        },
      ),
      userId: _.assign({},
        this.fields.id, {
          required: true
        },
      ),
      rate: _.assign({},
        this.fields.rate, {
          required: true
        },
      ),
    });

    schema.message(this.errorMessages);

    return this.constructor.sanitizeErrors(
      schema.validate(_.assign({}, rate)),
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