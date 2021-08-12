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
      ticketPriceDiamond: {
        type: Number,
      },
      ticketPrice: {
        type: Number,
      },
      count: {
        type: Number,
      },
      position: {
        type: Number,
      },
      competitionId: {
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
 

  create(competitionMember, throwErrors = true) {
    const schema = new Schema({
      userId: _.assign({},
        this.fields.userId, {
          required: true
        },
      ),
      ticketPriceDiamond: _.assign({},
        this.fields.ticketPriceDiamond, {
          required: true
        },
      ),
      ticketPrice: _.assign({},
        this.fields.ticketPrice, {
          required: false
        },
      ),
      count: _.assign({},
        this.fields.count, {
          required: false
        },
      ),
      position: _.assign({},
        this.fields.position, {
          required: false
        },
      ),
      competitionId: _.assign({},
        this.fields.competitionId, {
          required: false
        },
      ),
    });

    schema.message(this.errorMessages);

    return this.constructor.sanitizeErrors(
      schema.validate(_.assign({}, competitionMember)),
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