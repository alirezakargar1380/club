const Schema = require('validate');
const _ = require('lodash');
const log = require('../utils/log.utility');
const toString = require('../utils/to-string.utility');
const Exception = require('../utils/error.utility');

class Validate {
  constructor() {
    this.fields = {
      title: {
        type: String,
      },
      description: {
        type: String,
      },
      userId: {
        type: String,
      },
      order: {
        type: Number,
      },
      category: {
        type: Number,
      },
      used: {
        type: Boolean,
      },

    };
    this.errorMessages = {
      required: () => 'ERROR_MESSAGE_REQUIRED',
      validation: () => 'ERROR_MESSAGE_INVALID',
      type: () => 'ERROR_MESSAGE_WRONG_TYPE',
      length: () => 'ERROR_MESSAGE_INVALID_LENGTH',
    };
  }

  ticket(ticket, throwErrors = true) {
    const schema = new Schema({
      title: _.assign({},
        this.fields.title, {
          required: true
        },
      ),
      description: _.assign({},
        this.fields.description, {
          required: false
        },
      ),
      userId: _.assign({},
        this.fields.userId, {
          required: true
        },
      ),
      order: _.assign({},
        this.fields.order, {
          required: true
        },
      ),
      category: _.assign({},
        this.fields.category, {
          required: true
        },
      ),
    });

    schema.message(this.errorMessages);

    return this.constructor.sanitizeErrors(
      schema.validate(_.assign({}, ticket)),
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