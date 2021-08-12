const Schema = require('validate');
const _ = require('lodash');
const log = require('../utils/log.utility');
const toString = require('../utils/to-string.utility');
const Exception = require('../utils/error.utility');
const { console } = require('../utils/log.utility');

class Validate {
  constructor() {
    this.fields = {
      id: {
        type: Number,
      },
      text: {
        type: String,
      },
      subject: {
        type: String,
      },
      email: {
        type: String,
      },
      userId: {
        type: String,
      },
      runTime: {
        type: String,
      },
      runDate: {
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

  create(mail, throwErrors = true) {
    const schema = new Schema({
      emails: {
        type: Array,
        each: { type: String }
      },
      text: _.assign({},
        this.fields.text, {
          required: true
        },
      ),
      subject: _.assign({},
        this.fields.subject, {
          required: true
        },
      ),
      userId: _.assign({},
        this.fields.userId, {
          required: true
        },
      ),
      runTime: _.assign({},
        this.fields.runTime, {
          required: true
        },
      ),
      runDate: _.assign({},
        this.fields.runDate, {
          required: true
        },
      ),
    });

    schema.message(this.errorMessages);

    return this.constructor.sanitizeErrors(
      schema.validate(_.assign({}, mail)),
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