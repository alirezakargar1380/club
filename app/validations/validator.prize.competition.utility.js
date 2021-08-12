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
      userId: {
        type: String,
      },
      goodId: {
        type: Number,
      },
      order: {
        type: Number,
      },
      competitionId: {
        type: Number,
      },
      expireDay : {
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

  id(prize, throwErrors = true) {
    const schema = new Schema({
      id: _.assign({},
        this.fields.id, {
          required: true
        },
      ),
    });

    schema.message(this.errorMessages);

    return this.constructor.sanitizeErrors(
      schema.validate(_.assign({}, prize)),
      throwErrors,
    );
  }

  create(prize, throwErrors = true) {
    // console.log('---------prize----->',prize)
    const schema = new Schema({
      userId: _.assign({},
        this.fields.userId, {
          required: true
        },
      ),
      competitionId: _.assign({},
        this.fields.competitionId, {
          required: true
        },
      ),
      goodId: _.assign({},
        this.fields.goodId, {
          required: false
        },
      ),
      order: _.assign({},
        this.fields.order, {
          required: false
        },
      ),
      expireDay: _.assign({},
        this.fields.expireDay, {
          required: false
        },
      ),
    });

    schema.message(this.errorMessages);

    return this.constructor.sanitizeErrors(
      schema.validate(_.assign({}, prize)),
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