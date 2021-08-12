const _ = require('lodash');
const {
  Socket,
  Lottery,
  Ticket,
  Prize,
  Setting,
  FieldWork
} = require('../models');
const Exception = require('../utils/error.utility');
const {
  console
} = require('../utils/log.utility');
const log = require('../utils/log.utility')



async function index() {
  try {
    const fieldWorks = await FieldWork.findAll({
      include: [
        // {
        //   model: Lottery,
        //   as: 'prizes'
        // },
      ]
    })

    return fieldWorks;
  } catch (error) {
    log.error(error);
    throw Exception.setError(error, false);
  }
}


module.exports = {
  index,
}