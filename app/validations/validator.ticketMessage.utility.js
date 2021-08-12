const Schema = require('validate');
const _ = require('lodash');
const log = require('../utils/log.utility');
const toString = require('../utils/to-string.utility');
const Exception = require('../utils/error.utility');

class Validate {
  constructor() {
    this.fields = {
      id: {
        type: Number,
      },
      subject: {
        type: String,
      },
      description: {
        type: String,
      },
      priority: {
        type: Number,
      },
      state: {
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
 

  create(message, throwErrors = true) {
    const schema = new Schema({
      subject: _.assign({},
        this.fields.subject, {
          required: true
        },
      ),
      description: _.assign({},
        this.fields.description, {
          required: true
        },
      ),
      priority: _.assign({},
        this.fields.priority, {
          required: true
        },
      ),
      state: _.assign({},
        this.fields.state, {
          required: true
        },
      ),
      userId: _.assign({},
        this.fields.userId, {
          required: true
        },
      ),
    });

    schema.message(this.errorMessages);

    return this.constructor.sanitizeErrors(
      schema.validate(_.assign({}, message)),
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