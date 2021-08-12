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
      type: {
        type: Number,
        enum: [1, 0]
      },
      amount: {
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

  charge(wallet, throwErrors = true) {
    const schema = new Schema({
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
      amount: _.assign({},
        this.fields.amount, {
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

  confirmed(wallet, throwErrors = true) {
    const schema = new Schema({
      id: _.assign({},
        this.fields.id, {
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
      schema.validate(_.assign({}, wallet)),
      throwErrors,
    );
  }

  conversionRatioDiamondToCoin(wallet, throwErrors = true) {
    // console.log('-------wallet---->', wallet)
    const schema = new Schema({
      userId: _.assign({},
        this.fields.userId, {
          required: true
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
      schema.validate(_.assign({}, wallet)),
      throwErrors,
    );
  }

  conversionRatioCoinToDiamond(wallet, throwErrors = true) {
    // console.log('-------wallet---->', wallet)
    const schema = new Schema({
      userId: _.assign({},
        this.fields.userId, {
          required: true
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
      schema.validate(_.assign({}, wallet)),
      throwErrors,
    );
  }

  conversionRatioDiamondToCash(wallet, throwErrors = true) {
    // console.log('-------wallet---->', wallet)
    const schema = new Schema({
      userId: _.assign({},
        this.fields.userId, {
          required: true
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