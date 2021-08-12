const _ = require('lodash');
const axios = require('axios');
const qs = require('qs');
const { Competition } = require('../models');
const moment = require('moment');
const { Op } = require('sequelize');
const Exception = require('../utils/error.utility');
const { console } = require('../utils/log.utility');
const log = require('../utils/log.utility');
const walletService = require('../service/wallet.service');
const { error, success } = require('../utils/response.utitlity');

async function checkAuth($auth_token) {
  var paramObj = {
    auth_token: $auth_token,
    service: 'shid_club',
  };
  let param = qs.stringify(paramObj, {
    allowDots: true,
  });
  log.error('----checkAuth--------1------>');
  let res = await axios.post(
    'https://auth-shid.iran.liara.run/user/is-login',
    param,
    {
      auth: {
        username: 'shid',
        password: 'test',
      },
      headers: {
        auth_token: $auth_token,
        service: 'shid_club'
      }
    }
  );
  log.error('----checkAuth--------2------>');
  let data = res.data;

  if (_.isEqual(data.succsess, true)) return data.data.user;
  else return {};
}

async function verifyToken(req, res, next) {
  //!! THIS IS USING TEST USER DATA INSTEAD OF GETTING FROM API. SHOULD CHANGE LATER
  const bearerHeader = req.headers['authorization'];
  // let userObject = {
  // }
  // userObject.uuid = 'test';
  // userObject.role = 'admin-club';
  if (bearerHeader) {
    const userObject = await checkAuth(bearerHeader);

    if (_.isEmpty(userObject)) return error(res, 'این یوزر یافت نشد');

    if (
      !_.includes(
        ['user-club', 'admin-club', 'userAD-club'],
        userObject.role['shid_club']
      )
    ) {
      return error(res, 'این نقش در کلاب تعریف شده نیست');
    } else {
      req.userId = userObject.uuid;
      req.role = userObject.role['shid_club'];

      const wallet = await walletService.showWithUserId(userObject.uuid);
      if (_.isUndefined(wallet) || _.isEmpty(wallet)) {
        const newWallet = {
          userId: req.userId,
          coin: 0,
          diamond: 0,
        };

        await walletService.create(newWallet);
      }

      next();
    }
  } else {
    // Forbidden
    error(res, 'توکن موجود نیست');
  }
}

module.exports = {
  checkAuth,
  verifyToken,
};
