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
      title: {
        type: String,
      },
      description: {
        type: String,
      },
      image: {
        type: String,
      },
      runDate: {
        type: String,
      },
      runTime: {
        type: String,
      },
      type: {
        type: Number,
      },
      countGroup: {
        type: Number,
      },
      countMember: {
        type: Number,
      },
      countWinner: {
        type: Number,
      },
      parent: {
        type: Number,
      },
      priceForUser: {
        type: Number,
      },
      city: {
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

  create(competition, throwErrors = true) {
    const schema = new Schema({
      userId: _.assign({}, this.fields.userId, {
        required: true,
      }),
      title: _.assign({}, this.fields.title, {
        required: true,
      }),
      description: _.assign({}, this.fields.description, {
        required: false,
      }),
      runDate: _.assign({}, this.fields.runDate, {
        required: true,
      }),
      runTime: _.assign({}, this.fields.runTime, {
        required: true,
      }),
      image: _.assign({}, this.fields.image, {
        required: false,
      }),
      type: _.assign({}, this.fields.type, {
        required: true,
      }),
      countGroup: _.assign({}, this.fields.countGroup, {
        required: true,
      }),
      countMember: _.assign({}, this.fields.countMember, {
        required: false,
      }),
      countWinner: _.assign({}, this.fields.countWinner, {
        required: false,
      }),
      parent: _.assign({}, this.fields.parent, {
        required: false,
      }),
      priceForUser: _.assign({}, this.fields.priceForUser, {
        required: true,
      }),
      city: _.assign({}, this.fields.city, {
        required: true,
      }),
    });

    schema.message(this.errorMessages);

    return this.constructor.sanitizeErrors(
      schema.validate(_.assign({}, competition)),
      throwErrors
    );
  }

  static sanitizeErrors(errors, throwErrors) {
    const errs = _.map(errors, (error) => ({
      [error.path]: error.message,
    }));
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
