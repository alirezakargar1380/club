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
      like: {
        type: Number,
      },
      disLike: {
        type: Number,
      },
      type: {
        type: Number,
      },
      userId: {
        type: String,
      },
      parentId: {
        type: Number,
      },
      child: {
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

  id(question, throwErrors = true) {
    const schema = new Schema({
      id: _.assign({},
        this.fields.id, {
          required: true
        },
      ),
    });

    schema.message(this.errorMessages);

    return this.constructor.sanitizeErrors(
      schema.validate(_.assign({}, question)),
      throwErrors,
    );
  }

  question(question, throwErrors = true) {
    const schema = new Schema({
      like: _.assign({},
        this.fields.like, {
          required: false
        },
      ),
      disLike: _.assign({},
        this.fields.disLike, {
          required: false
        },
      ),
      type: _.assign({},
        this.fields.type, {
          required: true
        },
      ),
      userId: _.assign({},
        this.fields.userId, {
          required: true
        },
      ),
      parentId: _.assign({},
        this.fields.parentId, {
          required: false
        },
      ),
      child: _.assign({},
        this.fields.child, {
          required: false
        },
      ),
    });

    schema.message(this.errorMessages);

    return this.constructor.sanitizeErrors(
      schema.validate(_.assign({}, question)),
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