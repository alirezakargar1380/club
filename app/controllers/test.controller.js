const _ = require('lodash');
const {
  success,
  exception,
  error
} = require('../utils/response.utitlity')
const {
  Good,
  Setting
} = require('../models')
const goodService = require('../service/good.service')
const validate = require('../validations/validator.good.utility')

async function index(req, res) {
  try {

    return success(res, [{
      id: 1 ,
      name: 'mohsen'
    }]);
  } catch (error) {
    return exception(res, error.message);
  }
}


module.exports = {
  index,
}