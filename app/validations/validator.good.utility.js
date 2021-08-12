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
      price: {
        type: Number,
      },
      priceDiamond: {
        type: Number,
      },
      priceOfToman: {
        type: Number,
      },
      count: {
        type: Number,
      },
      expireDay: {
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


  good(good, throwErrors = true) {
    const schema = new Schema({
      userId: _.assign({},
        this.fields.userId, {
          required: true
        },
      ),
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
      image: _.assign({},
        this.fields.image, {
          required: false
        },
      ),
      price: _.assign({},
        this.fields.price, {
          required: true
        },
      ),
      priceDiamond: _.assign({},
        this.fields.priceDiamond, {
          required: true
        },
      ),
      priceOfToman: _.assign({},
        this.fields.priceOfToman, {
          required: true
        },
      ),
      count: _.assign({},
        this.fields.count, {
          required: true
        },
      ),
      expireDay: _.assign({},
        this.fields.expireDay, {
          required: true
        },
      ),
    });

    schema.message(this.errorMessages);

    return this.constructor.sanitizeErrors(
      schema.validate(_.assign({}, good)),
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