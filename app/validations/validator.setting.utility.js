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
      countTicket: {
        type: Number,
      },
      countPrize: {
        type: Number,
      },
      countSharedPrize: {
        type: Number,
      },
      conversionRatioDimondToCoin: {
        type: Number,
      },
      conversionRatioCoinToDimond: {
        type: Number,
      },
      percentFromSell: {
        type: Number,
      },
      countRouletteTicket: {
        type: Number,
      },
      countRoulettePrize: {
        type: Number,
      },
      priceForCreateCompetition: {
        type: Number,
      },
      constraintForCharge: {
        type: Number,
      },
      constraintForTransfer: {
        type: Number,
      },
      tax: {
        type: Number,
      },
      constraintForSellGood: {
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

  create(wallet, throwErrors = true) {
    const schema = new Schema({
      countTicket: _.assign({},
        this.fields.countTicket, 
      ),
      countPrize: _.assign({},
        this.fields.countPrize
      ),
      countSharedPrize: _.assign({},
        this.fields.countSharedPrize
      ),
      conversionRatioDimondToCoin: _.assign({},
        this.fields.conversionRatioDimondToCoin
      ),
      conversionRatioCoinToDimond: _.assign({},
        this.fields.conversionRatioDimondToCoin
      ),
      percentFromSell: _.assign({},
        this.fields.percentFromSell
      ),
      countRouletteTicket: _.assign({},
        this.fields.countRouletteTicket
      ),
      countRoulettePrize: _.assign({},
        this.fields.countRoulettePrize
      ),
      priceForCreateCompetition: _.assign({},
        this.fields.priceForCreateCompetition
      ),
      constraintForCharge: _.assign({},
        this.fields.constraintForCharge
      ),
      constraintForTransfer: _.assign({},
        this.fields.constraintForTransfer
      ),
      tax: _.assign({},
        this.fields.tax
      ),
      constraintForSellGood: _.assign({},
        this.fields.constraintForSellGood
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