const Schema = require('validate');
const _ = require('lodash');
const log = require('../utils/log.utility');
const toString = require('../utils/to-string.utility');
const Exception = require('../utils/error.utility');
const { console } = require('../utils/log.utility');

class Validate {
  constructor() {
    this.fields = {
      id: {
        type: Number,
      },
      image: {
        type: String,
      },
      type: {
        type: Number,
      },
      userId: {
        type: String,
      },
      isMain: {
        type: Boolean,
      },
      goodId: {
        type: Number,
      },
      competitionId: {
        type: Number,
      },
      rouletteId: {
        type: Number,
      },
      lotteryId: {
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

  create(file, throwErrors = true) {
    const schema = new Schema({
      file: [{
        name: {
          type: String,
          required: true
        },
        isMain: {
          type: Boolean,
          required: false
        },
        description: {
          type: String,
          required: false
        },
      }],
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
      goodId: _.assign({},
        this.fields.goodId, {
          required: false
        },
      ),
      lotteryId: _.assign({},
        this.fields.lotteryId, {
          required: false
        },
      ),
      rouletteId: _.assign({},
        this.fields.rouletteId, {
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
      schema.validate(_.assign({}, file)),
      throwErrors,
    );
  }


  getGoodImages(file, throwErrors = true) {
    const schema = new Schema({
      goodId: _.assign({},
        this.fields.goodId, {
          required: true
        },
      ),
    });

    schema.message(this.errorMessages);

    return this.constructor.sanitizeErrors(
      schema.validate(_.assign({}, file)),
      throwErrors,
    );
  }

  setIsMain(file, throwErrors = true) {
    log.info("----validate---file----->"+JSON.stringify(file))
    const schema = new Schema({
      fileId: _.assign({},
        this.fields.id, {
          required: true
        },
      ),
    });

    schema.message(this.errorMessages);

    return this.constructor.sanitizeErrors(
      schema.validate(_.assign({}, file)),
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