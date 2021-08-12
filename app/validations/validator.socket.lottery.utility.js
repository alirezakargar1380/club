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
      title: {
        type: String,
      },
      description: {
        type: String,
      },
      online: {
        type: Boolean,
      },
      location: {
        type: String,
      },
      image: {
        type: String,
      },
      repeat: {
        type: Number,
      },
      runTime: {
        type: String,
      },
      runDate: {
        type: String,
      },
      ticketPrice: {
        type: Number,
      },
      adPrice: {
        type: Number,
      },
      adPriceForDays: {
        type: Number,
      },
      adPriceAfterWin: {
        type: Number,
      },
      adPriceShared: {
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
      adPriceDiamondShared: {
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

  lottery(lottery, throwErrors = true) {
    const schema = new Schema({
      title: _.assign({},
        this.fields.title, {
          required: true
        },
      ),
      description: _.assign({},
        this.fields.description, {
          required: true
        },
      ),
      image: _.assign({},
        this.fields.image,
      ),
      online: _.assign({},
        this.fields.online,
      ),
      location: _.assign({},
        this.fields.location,
      ),
      runDate: _.assign({},
        this.fields.runDate, {
          required: true
        },
      ),
      runTime: _.assign({},
        this.fields.runTime, {
          required: true
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
      adPriceForDays: _.assign({},
        this.fields.adPriceForDays, {
          required: true
        },
      ),
      adPriceAfterWin: _.assign({},
        this.fields.adPriceAfterWin, {
          required: true
        },
      ),
      adPriceShared: _.assign({},
        this.fields.adPriceShared, {
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
      adPriceDiamondShared: _.assign({},
        this.fields.adPriceDiamondShared, {
          required: true
        },
      ),
    });

    schema.message(this.errorMessages);

    return this.constructor.sanitizeErrors(
      schema.validate(_.assign({}, lottery)),
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