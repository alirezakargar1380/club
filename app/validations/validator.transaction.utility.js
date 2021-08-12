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
      transactionId: {
        type: Number,
      },
      type: {
        type: Number,
        enum: [1, 0]
      },
      description: {
        type: String,
      },
      amount: {
        type: Number,
      },
      ticketId: {
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

  getConfirmedTransactionWithUserId(transaction, throwErrors = true) {
    // console.log('-----transaction---->', transaction);
    const schema = new Schema({
      userId: _.assign({},
        this.fields.id, {
          required: true
        },
      ),
    });

    schema.message(this.errorMessages);

    return this.constructor.sanitizeErrors(
      schema.validate(_.assign({}, transaction)),
      throwErrors,
    );
  }

  registerTeransaction(transaction, throwErrors = true) {
    log.info('----------registerTeransaction---------', transaction);
    const schema = new Schema({
      type: _.assign({},
        this.fields.type, {
          required: true
        },
      ),
      fromUserId: _.assign({},
        this.fields.id, {
          required: true
        },
      ),
      toUserId: _.assign({},
        this.fields.id, {
          required: true
        },
      ),
      description: _.assign({},
        this.fields.description, {
          required: false
        },
      ),
      amount: _.assign({},
        this.fields.amount, {
          required: true
        },
      ),
    });

    schema.message(this.errorMessages);

    return this.constructor.sanitizeErrors(
      schema.validate(_.assign({}, transaction)),
      throwErrors,
    );
  }

  registerChargeTransaction(transaction, throwErrors = true) {
    log.info('----------registerTeransaction---------', transaction);
    const schema = new Schema({
      type: _.assign({},
        this.fields.type, {
          required: true
        },
      ),
      toUserId: _.assign({},
        this.fields.id, {
          required: true
        },
      ),
      description: _.assign({},
        this.fields.description, {
          required: false
        },
      ),
      amount: _.assign({},
        this.fields.amount, {
          required: true
        },
      ),
    });

    schema.message(this.errorMessages);

    return this.constructor.sanitizeErrors(
      schema.validate(_.assign({}, transaction)),
      throwErrors,
    );
  }

  registerTicketTeransaction(transaction, throwErrors = true) {
    log.info('----------registerTeransaction---------', transaction);
    const schema = new Schema({
      type: _.assign({},
        this.fields.type, {
          required: true
        },
      ),
      fromUserId: _.assign({},
        this.fields.id, {
          required: true
        },
      ),
      toUserId: _.assign({},
        this.fields.id, {
          required: true
        },
      ),
      description: _.assign({},
        this.fields.description, {
          required: false
        },
      ),
      amount: _.assign({},
        this.fields.amount, {
          required: true
        },
      ),
            ticketId: _.assign({},
        this.fields.ticketId, {
          required: true
        },
      ),
    });

    schema.message(this.errorMessages);

    return this.constructor.sanitizeErrors(
      schema.validate(_.assign({}, transaction)),
      throwErrors,
    );
  }

  confirmedTransaction(transaction, throwErrors = true) {
    const schema = new Schema({
      userId: _.assign({},
        this.fields.id, {
          required: true
        },
      ),
      transactionId: _.assign({},
        this.fields.transactionId, {
          required: true
        },
      ),
    });

    schema.message(this.errorMessages);

    return this.constructor.sanitizeErrors(
      schema.validate(_.assign({}, transaction)),
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