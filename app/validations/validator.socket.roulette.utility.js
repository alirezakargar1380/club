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
      image: {
        type: String,
      },
      ticketPrice: {
        type: Number,
      },
      adPrice: {
        type: Number,
      },
      adPriceAfterWin: {
        type: Number,
      },
      adPriceForDays: {
        type: Number,
      },
      ticketPriceDiamond: {
        type: Number,
      },
      adPriceDiamond: {
        type: Number,
      },
      adPriceDiamondAfterWin: {
        type: Number,
      },
      adPriceDiamondForDays: {
        type: Number,
      },
      fromDate: {
        type: String,
      },
      countDay: {
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

        // data.title, 
      // data.description, 
      // data.image, 
      // data.ticketPrice,
      // data.adPrice
      // data.adPriceAfterWin,
      // data.adPriceForDays
  roulette(roulette, throwErrors = true) {
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
      image: _.assign({},
        this.fields.image, {
          required: false
        },
      ),
      ticketPrice: _.assign({},
        this.fields.ticketPrice, {
          required: true
        },
      ),
      adPrice: _.assign({},
        this.fields.adPrice, {
          required: true
        },
      ),
      adPriceAfterWin: _.assign({},
        this.fields.adPriceAfterWin, {
          required: true
        },
      ),
      adPriceForDays: _.assign({},
        this.fields.adPriceForDays, {
          required: true
        },
      ),
      ticketPriceDiamond: _.assign({},
        this.fields.ticketPriceDiamond, {
          required: true
        },
      ),
      adPriceDiamond: _.assign({},
        this.fields.adPriceDiamond, {
          required: true
        },
      ),
      adPriceDiamondAfterWin: _.assign({},
        this.fields.adPriceDiamondAfterWin, {
          required: true
        },
      ),
      adPriceDiamondForDays: _.assign({},
        this.fields.adPriceDiamondForDays, {
          required: true
        },
      ),
      fromDate: _.assign({},
        this.fields.fromDate, {
          required: true
        },
      ),
      countDay: _.assign({},
        this.fields.countDay, {
          required: true
        },
      ),
    });

    schema.message(this.errorMessages);

    return this.constructor.sanitizeErrors(
      schema.validate(_.assign({}, roulette)),
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