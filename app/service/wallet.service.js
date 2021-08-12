const _ = require('lodash');
const { Wallet } = require('../models');
const moment = require('moment');
const { Op } = require('sequelize');
const Exception = require('../utils/error.utility');
const { console } = require('../utils/log.utility');
const log = require('../utils/log.utility');
const settingService = require('../service/setting.service');
const transactionService = require('../service/transaction.service');
const lotteryService = require('../service/lottery.service');
const rouletteService = require('../service/roulette.service');
const goodService = require('../service/good.service');
const competitionService = require('../service/competition.service');
const sellGoodService = require('../service/sellGood.service');
const sellGood = require('../models/sellGood');
const good = require('../socket/good');

async function index() {
  try {
    const wallets = await Wallet.findAll();

    log.info('--------wallets------->', JSON.stringify(wallets));
    return wallets;
  } catch (error) {
    log.error(error);
    throw Exception.setError(error, false);
  }
}

async function create(wallet) {
  try {
    const createWallet = await Wallet.create({
      userId: wallet.userId,
      diamond: wallet.diamond,
      coin: wallet.coin,
    });

    return createWallet;
  } catch (error) {
    log.error(error);
    throw Exception.setError(error, false);
  }
}

async function showWithUserId(userId) {
  log.info('-----showWithUserId----' + userId);
  try {
    var wallet = await Wallet.findOne({
      where: {
        userId: userId,
      },
    });
    log.info('-----walletwallet----' + JSON.stringify(wallet));
    // if (!wallet) {
    //   throw Exception.setError("این آیتم موجود نمیباشد", true);
    // }

    return wallet;
  } catch (error) {
    log.error(error);
    throw Exception.setError(error, false);
  }
}

async function show(id) {
  try {
    var wallet = await Wallet.findByPk(id);

    if (!wallet) {
      throw Exception.setError('این آیتم موجود نمیباشد', true);
    }

    return wallet;
  } catch (error) {
    log.error(error);
    throw Exception.setError(error, false);
  }
}

async function charge(userId, amount, type) {
  try {
    log.info('---userId-----' + userId);
    log.info('--amount------' + amount);
    log.info('----type----' + type);

    var wallet = await Wallet.findOne({
      where: {
        userId: userId,
      },
    });
    log.info('----wallet----' + JSON.stringify(wallet));
    if (_.isUndefined(wallet) || _.isEmpty(wallet)) {
      log.info('------if----------' + JSON.stringify(wallet));
      let newWallet = {
        userId: userId,
        coin: 0,
        diamond: 0,
      };

      log.info('--------' + JSON.stringify(newWallet));
      wallet = await create(newWallet);
    }

    log.info('--55------');
    let newWallet = {};
    // for coin
    if (_.isEqual(type, 0)) newWallet.coin = wallet.coin + amount;

    // for diamond
    if (_.isEqual(type, 1)) newWallet.diamond = wallet.diamond + amount;

    log.info('----newWallet----' + JSON.stringify(newWallet));
    await wallet.update({
      ...wallet, //spread out existing task
      ...newWallet, //spread out body - the differences in the body will over ride the task returned from DB.
    });

    const transaction = {
      type: type,
      fromUserId: null,
      toUserId: userId,
      description: ' شارژ اکانت ',
      amount: +amount,
      autoExecute: true,
    };
    log.info('----transaction----' + JSON.stringify(transaction));
    await transactionService.chargWallet(transaction);

    return true;
  } catch (error) {
    log.error(error);
    throw Exception.setError(error, false);
  }
}

async function conversionRatioDiamondToCoin(userId, amount) {
  try {
    log.info('----conversionRatioDiamondToCoin------->');
    var wallet = await Wallet.findOne({
      where: {
        userId: userId,
      },
    });

    if (_.isUndefined(wallet) || _.isEmpty(wallet)) {
      log.info('------if----------' + JSON.stringify(wallet));
      const newWallet = {
        userId: userId,
        coin: 0,
        diamond: 0,
      };
      log.info('--------' + JSON.stringify(newWallet));
      wallet = await create(newWallet);

      throw Exception.setError('موجودی سکه کافی نیست', false);
    }

    let newWallet = {};

    // for diamond
    if (_.lt(wallet.diamond, amount)) {
      throw Exception.setError('این مقدار الماس موجود نمیباشد', true);
    }
    // log.info('----wallet---11---->'+JSON.stringify(wallet));
    log.info('-------1-' + JSON.stringify(newWallet));

    const setting = await settingService.index();
    log.info('----setting---11---->' + JSON.stringify(setting));
    if (_.isEqual(_.size(setting), 0)) {
      throw Exception.setError('لطفا تنظیمات را انجام دهید', true);
    }

    if (_.isEqual(_.size(setting), 0)) {
      throw Exception.setError('لطفا تنظیمات را انجام دهید', true);
    }

    log.info('----wallet.coin------->' + wallet.coin);
    log.info('----amount------->' + amount);
    log.info(
      '----setting[0].conversionRatioDimondToCoin------->' +
        setting[0].conversionRatioDimondToCoin
    );
    log.info(
      '----setting[0].(amount * setting[0].conversionRatioDimondToCoin)------->' +
        amount * setting[0].conversionRatioDimondToCoin
    );
    newWallet = {
      coin:
        parseInt(wallet.coin) + amount * setting[0].conversionRatioDimondToCoin,
      diamond: wallet.diamond - amount,
      conversionRatioDimondToCoin: wallet.conversionRatioDimondToCoin,
    };
    log.info(
      '----newWallet--5555----->' +
        parseInt(wallet.coin) +
        parseInt(amount * setting[0].conversionRatioDimondToCoin)
    );
    log.info('----newWallet------->' + JSON.stringify(newWallet));

    await wallet.update({
      ...wallet, //spread out existing task
      ...newWallet, //spread out body - the differences in the body will over ride the task returned from DB.
    });

    return true;
  } catch (error) {
    log.error(error);
    throw Exception.setError(error, false);
  }
}

async function conversionRatioCoinToDiamond(userId, amount) {
  try {
    log.info('----conversionRatioCoinToDiamond------->');
    var wallet = await Wallet.findOne({
      where: {
        userId: userId,
      },
    });

    if (_.isUndefined(wallet) || _.isEmpty(wallet)) {
      log.info('------if----------' + JSON.stringify(wallet));
      const newWallet = {
        userId: userId,
        coin: 0,
        diamond: 0,
      };
      log.info('--------' + JSON.stringify(newWallet));
      wallet = await create(newWallet);

      throw Exception.setError('موجودی سکه کافی نیست', false);
    }

    let newWallet = {};

    // for diamond
    if (_.lt(wallet.coin, amount)) {
      throw Exception.setError('این مقدار سکه موجود نمیباشد', true);
    }
    // log.info('----wallet---11---->'+JSON.stringify(wallet));
    log.info('-------1-' + JSON.stringify(newWallet));

    const setting = await settingService.index();
    log.info('----setting---11---->' + JSON.stringify(setting));
    if (_.isEqual(_.size(setting), 0)) {
      throw Exception.setError('لطفا تنظیمات را انجام دهید', true);
    }

    if (_.isEqual(_.size(setting), 0)) {
      throw Exception.setError('لطفا تنظیمات را انجام دهید', true);
    }

    log.info('----wallet.coin------->' + wallet.coin);
    log.info('----amount------->' + amount);
    log.info(
      '----setting[0].conversionRatioDimondToCoin------->' +
        setting[0].conversionRatioCoinToDimond
    );
    log.info(
      '----setting[0].(amount * setting[0].conversionRatioDimondToCoin)------->' +
        amount * setting[0].conversionRatioCoinToDimond
    );
    newWallet = {
      diamond:
        parseInt(wallet.diamond) +
        amount * setting[0].conversionRatioCoinToDimond,
      coin: wallet.coin - amount,
      conversionRatioDimondToCoin: wallet.conversionRatioCoinToDimond,
    };
    log.info(
      '----newWallet--5555----->' +
        parseInt(wallet.coin) +
        parseInt(amount * setting[0].conversionRatioCoinToDimond)
    );
    log.info('----newWallet------->' + JSON.stringify(newWallet));

    await wallet.update({
      ...wallet, //spread out existing task
      ...newWallet, //spread out body - the differences in the body will over ride the task returned from DB.
    });

    return true;
  } catch (error) {
    log.error(error);
    throw Exception.setError(error, false);
  }
}

async function conversionRatioDiamondToCash(userId, amount) {
  try {
    log.info('----conversionRatioCoinToDiamond------->');
    var wallet = await Wallet.findOne({
      where: {
        userId: userId,
      },
    });

    if (_.isUndefined(wallet) || _.isEmpty(wallet)) {
      log.info('------if----------' + JSON.stringify(wallet));
      const newWallet = {
        userId: userId,
        coin: 0,
        diamond: 0,
      };
      log.info('--------' + JSON.stringify(newWallet));
      wallet = await create(newWallet);

      throw Exception.setError('موجودی سکه کافی نیست', false);
    }

    let newWallet = {};

    // for diamond
    if (_.lt(wallet.diamond, amount)) {
      throw Exception.setError('این مقدار الماس موجود نمیباشد', true);
    }
    // log.info('----wallet---11---->'+JSON.stringify(wallet));
    log.info('-------1-' + JSON.stringify(newWallet));

    const setting = await settingService.index();
    log.info('----setting---11---->' + JSON.stringify(setting));
    if (_.isEqual(_.size(setting), 0)) {
      throw Exception.setError('لطفا تنظیمات را انجام دهید', true);
    }

    newWallet = {
      diamond: parseInt(wallet.diamond) - amount,
    };

    await wallet.update({
      ...wallet, //spread out existing task
      ...newWallet, //spread out body - the differences in the body will over ride the task returned from DB.
    });

    const transaction = {
      type: 1,
      fromUserId: userId,
      toUserId: userId,
      description: 'تبدیل الماس به پول',
      amount: 0,
      amountDiamond: amount,
      autoExecute: true,
    };
    log.info('----if2-transaction---' + JSON.stringify(transaction));
    await transactionService.changeToCash(transaction);

    return true;
  } catch (error) {
    log.error(error);
    throw Exception.setError(error, false);
  }
}

async function transferCash(fromUserId, toUserId, amount, type) {
  try {
    var walletFrom = await Wallet.findOne({
      where: {
        userId: fromUserId,
      },
    });

    var walletTo = await Wallet.findOne({
      where: {
        userId: toUserId,
      },
    });

    if (_.isUndefined(walletFrom) || _.isEmpty(walletFrom)) {
      const newWallet = {
        userId: fromUserId,
        coin: 0,
        diamond: 0,
      };

      walletFrom = await create(newWallet);

      throw Exception.setError('سکه به اندازه کافی موجود نمیباشد', true);
    }

    if (_.isUndefined(walletTo) || _.isEmpty(walletTo)) {
      const newWallet = {
        userId: toUserId,
        coin: 0,
        diamond: 0,
      };

      walletTo = await create(newWallet);
    }

    let newWallet = {};
    log.info('----1----type---->' + type);
    if (_.isEqual(type, 0)) {
      // for coin
      if (_.lt(walletFrom.coin, amount)) {
        throw Exception.setError('این مقدار سکه موجود نمیباشد', true);
      }

      newWallet = {};
      newWallet.coin = walletFrom.coin - amount;
      await walletFrom.update({
        ...walletFrom, //spread out existing task
        ...newWallet, //spread out body - the differences in the body will over ride the task returned from DB.
      });
      log.info('----1----walletFrom---->' + JSON.stringify(newWallet));

      newWallet = {};
      newWallet.coin = walletTo.coin + amount;
      await walletTo.update({
        ...walletTo, //spread out existing task
        ...newWallet, //spread out body - the differences in the body will over ride the task returned from DB.
      });
      log.info('----1----walletTo---->' + JSON.stringify(newWallet));
    }
    if (_.isEqual(type, 1)) {
      // for diamond
      if (_.lt(walletFrom.diamond, amount)) {
        throw Exception.setError('این مقدار الماس موجود نمیباشد', true);
      }

      newWallet = {};
      newWallet.diamond = walletFrom.diamond - amount;
      await walletFrom.update({
        ...walletFrom, //spread out existing task
        ...newWallet, //spread out body - the differences in the body will over ride the task returned from DB.
      });
      log.info('----1----walletTo---->' + JSON.stringify(newWallet));
      newWallet = {};
      newWallet.diamond = walletTo.diamond + amount;
      await walletTo.update({
        ...walletTo, //spread out existing task
        ...newWallet, //spread out body - the differences in the body will over ride the task returned from DB.
      });
      log.info('----1----walletTo---->' + JSON.stringify(newWallet));
    }

    return true;
  } catch (error) {
    log.error(error);
    throw Exception.setError(error, false);
  }
}

async function buyTicket(ticket) {
  log.info('------buyTicket----------' + JSON.stringify(ticket));
  log.info(JSON.stringify(ticket));
  try {
    const setting = await settingService.index();
    if (_.isEqual(_.size(setting), 0)) {
      throw Exception.setError('لطفا تنظیمات را انجام دهید', true);
    }

    if (_.isEqual(_.size(setting), 0)) {
      throw Exception.setError('لطفا تنظیمات را انجام دهید', true);
    }

    const wallet = await showWithUserId(ticket.userId);

    // get price for lottery or roulette
    if (_.isEqual(ticket.category, 1)) {
      //  lottery
      const lottery = await lotteryService.show(ticket.lotteryId);
      log.info('----if2-lottery---' + JSON.stringify(lottery));
      if (_.lt(wallet.coin, lottery.ticketPrice))
        throw Exception.setError('موجودی سکه کافی نیست', false);

      if (_.lt(wallet.diamond, lottery.ticketPriceDiamond))
        throw Exception.setError('موجودی الماس کافی نیست', false);

      newWallet = {};
      newWallet.coin =
        wallet.coin -
        (lottery.ticketPrice +
          _.round((lottery.ticketPrice * setting[0].tax) / 100));
      newWallet.diamond =
        wallet.diamond -
        (lottery.ticketPriceDiamond +
          _.round((lottery.ticketPriceDiamond * setting[0].tax) / 100));
      log.info('----if2-newWallet---' + JSON.stringify(newWallet));
      await wallet.update({
        ...wallet, //spread out existing task
        ...newWallet, //spread out body - the differences in the body will over ride the task returned from DB.
      });

      const transaction = {
        type: 0,
        fromUserId: ticket.userId,
        toUserId: null,
        description: 'خرید بلیط برای قرعه کشی',
        amount:
          -lottery.ticketPrice -
          _.round((lottery.ticketPrice * setting[0].tax) / 100),
        amountDiamond:
          -lottery.ticketPriceDiamond -
          _.round((lottery.ticketPrice * setting[0].tax) / 100),
        autoExecute: true,
      };
      log.info('----if2-transaction---' + JSON.stringify(transaction));
      await transactionService.buyTicket(transaction);
    }
    if (_.isEqual(ticket.category, 2)) {
      //  roulette
      const roulette = await rouletteService.show(ticket.rouletteId);

      if (_.lt(wallet.coin, roulette.ticketPrice))
        throw Exception.setError('موجودی سکه کافی نیست', false);

      if (_.lt(wallet.diamond, roulette.ticketPriceDiamond))
        throw Exception.setError('موجودی الماس کافی نیست', false);

      newWallet = {};
      newWallet.coin =
        wallet.coin -
        (roulette.ticketPrice +
          _.round((roulette.ticketPrice * setting[0].tax) / 100));
      newWallet.diamond =
        wallet.diamond -
        (roulette.ticketPriceDiamond +
          _.round((roulette.ticketPriceDiamond * setting[0].tax) / 100));
      await wallet.update({
        ...wallet, //spread out existing task
        ...newWallet, //spread out body - the differences in the body will over ride the task returned from DB.
      });

      const transaction = {
        type: 0,
        fromUserId: ticket.userId,
        toUserId: null,
        description: 'خرید بلیط برای گردونه',
        amount:
          -roulette.ticketPrice -
          _.round((roulette.ticketPrice * setting[0].tax) / 100),
        amountDiamond:
          -roulette.ticketPriceDiamond -
          _.round((roulette.ticketPriceDiamond * setting[0].tax) / 100),
        autoExecute: true,
      };

      await transactionService.buyTicket(transaction);
    }

    if (_.isEqual(ticket.category, 3)) {
      //  roulette
      const competition = await competitionService.show(ticket.competitionId);

      if (_.lt(wallet.coin, competition.priceForUser))
        throw Exception.setError('موجودی سکه کافی نیست', false);

      if (_.lt(wallet.diamond, competition.priceDiamondForUser))
        throw Exception.setError('موجودی الماس کافی نیست', false);

      newWallet = {};
      newWallet.coin =
        wallet.coin -
        competition.priceForUser -
        _.round((competition.priceForUser * setting[0].tax) / 100);
      newWallet.diamond =
        wallet.diamond -
        competition.priceDiamondForUser -
        _.round((competition.priceDiamondForUser * setting[0].tax) / 100);
      await wallet.update({
        ...wallet, //spread out existing task
        ...newWallet, //spread out body - the differences in the body will over ride the task returned from DB.
      });

      const transaction = {
        type: 0,
        fromUserId: ticket.userId,
        toUserId: null,
        description: 'خرید بلیط برای مسابقه',
        amount:
          -competition.priceForUser -
          _.round((competition.priceForUser * setting[0].tax) / 100),
        amountDiamond:
          -competition.priceDiamondForUser -
          _.round((competition.priceDiamondForUser * setting[0].tax) / 100),
        autoExecute: true,
      };

      await transactionService.buyTicket(transaction);
    }

    return true;
  } catch (error) {
    log.error(error);
    throw Exception.setError(error, false);
  }
}

async function buyTicketForVisitor(positionPrice) {
  log.info('------position----------' + JSON.stringify(positionPrice));

  try {
    const setting = await settingService.index();
    if (_.isEqual(_.size(setting), 0)) {
      throw Exception.setError('لطفا تنظیمات را انجام دهید', true);
    }

    if (_.isEqual(_.size(setting), 0)) {
      throw Exception.setError('لطفا تنظیمات را انجام دهید', true);
    }

    const wallet = await showWithUserId(positionPrice.userId);

    newWallet = {};
    newWallet.coin =
      wallet.coin -
      (positionPrice.coin +
        _.round((positionPrice.coin * setting[0].tax) / 100));
    newWallet.diamond =
      wallet.diamond -
      (positionPrice.diamond +
        _.round((positionPrice.diamond * setting[0].tax) / 100));
    log.info('----if2-newWallet---' + JSON.stringify(newWallet));
    await wallet.update({
      ...wallet, //spread out existing task
      ...newWallet, //spread out body - the differences in the body will over ride the task returned from DB.
    });

    const transaction = {
      type: 0,
      fromUserId: ticket.userId,
      toUserId: null,
      description: 'خرید بلیط برای تماشای مسابقه',
      amount:
        -positionPrice.coin -
        _.round((positionPrice.coin * setting[0].tax) / 100),
      amountDiamond:
        -positionPrice.diamond -
        _.round((positionPrice.diamond * setting[0].tax) / 100),
      autoExecute: true,
    };
    log.info('----if2-transaction---' + JSON.stringify(transaction));
    await transactionService.buyTicket(transaction);

    return true;
  } catch (error) {
    log.error(error);
    throw Exception.setError(error, false);
  }
}

async function buyTicketForCompetition(competitionMember) {
  log.info(
    '------competitionMember----------' + JSON.stringify(competitionMember)
  );

  try {
    const setting = await settingService.index();
    if (_.isEqual(_.size(setting), 0)) {
      throw Exception.setError('لطفا تنظیمات را انجام دهید', true);
    }

    if (_.isEqual(_.size(setting), 0)) {
      throw Exception.setError('لطفا تنظیمات را انجام دهید', true);
    }

    const wallet = await showWithUserId(positionPrice.userId);

    newWallet = {};
    newWallet.coin =
      wallet.coin -
      (positionPrice.coin +
        _.round((positionPrice.coin * setting[0].tax) / 100));
    newWallet.diamond =
      wallet.diamond -
      (positionPrice.diamond +
        _.round((positionPrice.diamond * setting[0].tax) / 100));
    log.info('----if2-newWallet---' + JSON.stringify(newWallet));
    await wallet.update({
      ...wallet, //spread out existing task
      ...newWallet, //spread out body - the differences in the body will over ride the task returned from DB.
    });

    const transaction = {
      type: 0,
      fromUserId: ticket.userId,
      toUserId: null,
      description: 'خرید بلیط برای  مسابقه',
      amount:
        -positionPrice.coin -
        _.round((positionPrice.coin * setting[0].tax) / 100),
      amountDiamond:
        -positionPrice.diamond -
        _.round((positionPrice.diamond * setting[0].tax) / 100),
      autoExecute: true,
    };
    log.info('----if2-transaction---' + JSON.stringify(transaction));
    await transactionService.buyTicket(transaction);

    return true;
  } catch (error) {
    log.error(error);
    throw Exception.setError(error, false);
  }
}

async function createCompetition(
  userId,
  priceForCreateCompetition,
  priceDiamondForCreateCompetition
) {
  try {
    const setting = await settingService.index();
    if (_.isEqual(_.size(setting), 0)) {
      throw Exception.setError('لطفا تنظیمات را انجام دهید', true);
    }

    if (_.isEqual(_.size(setting), 0)) {
      throw Exception.setError('لطفا تنظیمات را انجام دهید', true);
    }

    const wallet = await showWithUserId(userId);
    if (_.lt(wallet.coin, priceForCreateCompetition))
      throw Exception.setError('موجودی سکه کافی نیست', false);

    // check confirmed wallet
    if (_.isEqual(wallet.confirmedBy, null)) {
      throw Exception.setError(
        'برای این کار ابتدا حساب شما باید تایید گردد',
        false
      );
    }

    newWallet = {};
    newWallet.coin =
      wallet.coin -
      (priceForCreateCompetition +
        _.round((priceForCreateCompetition * setting[0].tax) / 100));
    newWallet.codiamondin =
      wallet.diamond -
      (priceDiamondForCreateCompetition +
        _.round((priceDiamondForCreateCompetition * setting[0].tax) / 100));

    log.info('--------newWallet------->' + JSON.stringify(newWallet));

    await wallet.update({
      ...wallet,
      ...newWallet,
    });

    const transaction = {
      type: 0,
      fromUserId: userId,
      toUserId: null,
      description: 'هزینه ایجاد مسابقه',
      amount: -(
        priceForCreateCompetition +
        _.round((priceForCreateCompetition * setting[0].tax) / 100)
      ),
      amountDiamond: -(
        priceDiamondForCreateCompetition +
        _.round((priceDiamondForCreateCompetition * setting[0].tax) / 100)
      ),
      autoExecute: true,
    };
    log.info('--------transaction------->' + JSON.stringify(transaction));
    await transactionService.buyTicket(transaction);
    log.info('--------transaction---1---->');

    return true;
  } catch (error) {
    log.error(error);
    throw Exception.setError(error, false);
  }
}

async function Participation(userId, priceForUser, priceDiamondForUser) {
  try {
    const setting = await settingService.index();
    if (_.isEqual(_.size(setting), 0)) {
      throw Exception.setError('لطفا تنظیمات را انجام دهید', true);
    }

    if (_.isEqual(_.size(setting), 0)) {
      throw Exception.setError('لطفا تنظیمات را انجام دهید', true);
    }

    const wallet = await showWithUserId(userId);
    log.info('------userId------>' + userId);
    log.info('------priceForCreateCompetition------>' + priceForUser);
    if (_.lt(wallet.coin, priceForUser))
      throw Exception.setError('موجودی سکه کافی نیست', false);

    newWallet = {};
    newWallet.coin =
      wallet.coin -
      (priceForUser + _.round((priceForUser * setting[0].tax) / 100));
    newWallet.diamond =
      wallet.diamond -
      (priceDiamondForUser +
        _.round((priceDiamondForUser * setting[0].tax) / 100));

    await wallet.update({
      ...wallet,
      ...newWallet,
    });

    const transaction = {
      type: 0,
      fromUserId: userId,
      toUserId: null,
      description: 'هزینه شرکت در مسابقه',
      amount: -(priceForUser + _.round((priceForUser * setting[0].tax) / 100)),
      amountDiamond: -(
        priceDiamondForUser +
        _.round((priceDiamondForUser * setting[0].tax) / 100)
      ),
      autoExecute: true,
    };

    await transactionService.buyTicket(transaction);

    return true;
  } catch (error) {
    log.error(error);
    throw Exception.setError(error, false);
  }
}

async function ParticipationGroup(userId, priceForUser, priceDiamondForUser) {
  try {
    const setting = await settingService.index();
    if (_.isEqual(_.size(setting), 0)) {
      throw Exception.setError('لطفا تنظیمات را انجام دهید', true);
    }

    if (_.isEqual(_.size(setting), 0)) {
      throw Exception.setError('لطفا تنظیمات را انجام دهید', true);
    }

    const wallet = await showWithUserId(userId);
    log.info('------userId------>' + userId);
    log.info('------priceForCreateCompetition------>' + priceForUser);
    if (_.lt(wallet.coin, priceForUser))
      throw Exception.setError('موجودی سکه کافی نیست', false);

    newWallet = {};
    newWallet.coin =
      wallet.coin -
      (priceForUser + _.round((priceForUser * setting[0].tax) / 100));
    newWallet.diamond =
      wallet.diamond -
      (priceDiamondForUser +
        _.round((priceDiamondForUser * setting[0].tax) / 100));

    await wallet.update({
      ...wallet,
      ...newWallet,
    });

    const transaction = {
      type: 0,
      fromUserId: userId,
      toUserId: null,
      description: 'هزینه شرکت  گروه در مسابقه',
      amount: -(priceForUser + _.round((priceForUser * setting[0].tax) / 100)),
      amountDiamond: -(
        priceDiamondForUser +
        _.round((priceDiamondForUser * setting[0].tax) / 100)
      ),
      autoExecute: true,
    };

    await transactionService.buyTicket(transaction);

    return true;
  } catch (error) {
    log.error(error);
    throw Exception.setError(error, false);
  }
}

async function buyPrize(prize) {
  try {
    const setting = await settingService.index();
    if (_.isEqual(_.size(setting), 0)) {
      throw Exception.setError('لطفا تنظیمات را انجام دهید', true);
    }

    if (_.isEqual(_.size(setting), 0)) {
      throw Exception.setError('لطفا تنظیمات را انجام دهید', true);
    }

    log.info('--roulette.show---before---55---->' + JSON.stringify(prize));
    const wallet = await showWithUserId(prize.userId);

    if (_.isEqual(wallet.confirmed, 0) || _.isEqual(wallet.confirmed, 1))
      throw Exception.setError(
        'برای این کار ابتدا حساب شما باید تایید گردد',
        false
      );

    if (_.isUndefined(wallet) || _.isEmpty(wallet)) {
      const newWallet = {
        userId: prize.userId,
        coin: 0,
        diamond: 0,
      };
      log.info('--------' + JSON.stringify(newWallet));
      await create(newWallet);

      throw Exception.setError('موجودی سکه کافی نیست', false);
    }

    // get price for lottery or roulette
    if (_.isEqual(prize.category, 1)) {
      //  lottery
      const lottery = await lotteryService.show(prize.lotteryId);

      if (
        _.lt(
          wallet.coin,
          lottery.adPrice + (lottery.adPrice * setting[0].tax) / 100
        )
      )
        throw Exception.setError('موجودی سکه کافی نیست', false);

      if (
        _.lt(
          wallet.diamond,
          lottery.adPriceDiamond +
            (lottery.adPriceDiamond * setting[0].tax) / 100
        )
      )
        throw Exception.setError('موجودی الماس کافی نیست', false);

      newWallet = {};
      newWallet.coin =
        wallet.coin -
        (lottery.adPrice + _.round((lottery.adPrice * setting[0].tax) / 100));
      newWallet.diamond =
        wallet.diamond -
        (lottery.adPriceDiamond +
          _.round((lottery.adPriceDiamond * setting[0].tax) / 100));
      log.info('---newWalletnewWallet-------->' + JSON.stringify(newWallet));
      await wallet.update({
        ...wallet, //spread out existing task
        ...newWallet, //spread out body - the differences in the body will over ride the task returned from DB.
      });

      const transaction = {
        type: 0,
        fromUserId: prize.userId,
        toUserId: null,
        description: 'خرید جایگاه جایزه برای قرعه کشی',
        amount:
          -lottery.adPrice - _.round((lottery.adPrice * setting[0].tax) / 100),
        amountDiamond:
          -lottery.adPriceDiamond -
          _.round((lottery.adPriceDiamond * setting[0].tax) / 100),
        autoExecute: true,
      };

      await transactionService.buyTicket(transaction);
    } else {
      //  roulette
      log.info('--roulette.show---before------->' + JSON.stringify(prize));
      const roulette = await rouletteService.show(prize.rouletteId);
      log.info('--roulette.show---------->');
      if (_.lt(wallet.coin, roulette.adPrice))
        throw Exception.setError('موجودی سکه کافی نیست', false);

      newWallet = {};
      newWallet.coin =
        wallet.coin -
        (roulette.adPrice + _.round((roulette.adPrice * setting[0].tax) / 100));
      newWallet.diamond =
        wallet.diamond -
        (roulette.adPriceDiamond +
          _.round((roulette.adPriceDiamond * setting[0].tax) / 100));
      await wallet.update({
        ...wallet, //spread out existing task
        ...newWallet, //spread out body - the differences in the body will over ride the task returned from DB.
      });

      const transaction = {
        type: 0,
        fromUserId: prize.userId,
        toUserId: null,
        description: 'خرید  جایگاه جایزه برای گردونه',
        amount:
          -roulette.adPrice -
          _.round((roulette.adPrice * setting[0].tax) / 100),
        amountDiamond:
          -roulette.adPriceDiamond -
          _.round((roulette.adPriceDiamond * setting[0].tax) / 100),
        autoExecute: true,
      };

      await transactionService.buyTicket(transaction);
    }

    return true;
  } catch (error) {
    log.error(error);
    throw Exception.setError(error, false);
  }
}

async function buyGood(goodId, count, userId) {
  log.info('------buyGood----------' + goodId);
  log.info('------count----------' + count);
  log.info('------userId----------' + userId);
  try {
    const setting = await settingService.index();
    if (_.isEqual(_.size(setting), 0)) {
      throw Exception.setError('لطفا تنظیمات را انجام دهید', true);
    }

    if (_.isEqual(_.size(setting), 0)) {
      throw Exception.setError('لطفا تنظیمات را انجام دهید', true);
    }

    const wallet = await showWithUserId(userId);

    log.info('------555----------' + JSON.stringify(wallet));
    if (_.isUndefined(wallet) || _.isEmpty(wallet)) {
      log.info('------if----------' + JSON.stringify(wallet));
      const newWallet = {
        userId: prize.userId,
        coin: 0,
        diamond: 0,
      };
      log.info('--------' + JSON.stringify(newWallet));
      await create(newWallet);

      throw Exception.setError('موجودی سکه کافی نیست', false);
    }

    // get price for lottery or roulette

    //  lottery
    const good = await goodService.show(goodId);
    log.info('-----good---' + JSON.stringify(good));
    if (
      _.lt(
        wallet.coin,
        good.price * count +
          _.round((good.price * count * setting[0].tax) / 100)
      )
    )
      throw Exception.setError('موجودی سکه کافی نیست', false);

    if (
      _.lt(
        wallet.diamond,
        good.priceDiamond * count +
          _.round((good.priceDiamond * count * setting[0].tax) / 100)
      )
    )
      throw Exception.setError('موجودی سکه کافی نیست', false);

    newWallet = {};
    newWallet.coin =
      wallet.coin -
      good.price * count -
      _.round((good.price * count * setting[0].tax) / 100);
    newWallet.diamond =
      wallet.diamond -
      good.priceDiamond * count -
      _.round((good.priceDiamond * count * setting[0].tax) / 100);
    log.info('----if2-newWallet---' + JSON.stringify(newWallet));
    await wallet.update({
      ...wallet, //spread out existing task
      ...newWallet, //spread out body - the differences in the body will over ride the task returned from DB.
    });

    const transaction = {
      type: 0,
      fromUserId: userId,
      toUserId: null,
      description: `خرید کالای ${good.title}  به تعداد ${count}`,
      amount:
        -(good.price * count) -
        _.round((good.price * count * setting[0].tax) / 100),
      amountDiamond:
        -(good.priceDiamond * count) -
        _.round((good.priceDiamond * count * setting[0].tax) / 100),
      autoExecute: true,
    };
    log.info('----if2-transaction---' + JSON.stringify(transaction));
    await transactionService.buyTicket(transaction);

    // aduser
    const walletAdUser = await showWithUserId(good.userId);
    newWalletAdUser = {};
    newWalletAdUser.coin = walletAdUser.coin + good.price * count;
    newWalletAdUser.diamond = walletAdUser.diamond + good.priceDiamond * count;
    log.info('----if2-newWallet---' + JSON.stringify(newWallet));
    await walletAdUser.update({
      ...walletAdUser, //spread out existing task
      ...newWalletAdUser, //spread out body - the differences in the body will over ride the task returned from DB.
    });

    const transactionAdUser = {
      type: 0,
      fromUserId: null,
      toUserId: good.userId,
      description: `خرید کالای ${good.title}  به تعداد ${count}`,
      amount: good.price * count,
      amountDiamond: good.priceDiamond * count,
      autoExecute: true,
    };
    log.info(
      '----if2-transactionAdUser---' + JSON.stringify(transactionAdUser)
    );
    await transactionService.buyTicket(transactionAdUser);

    return true;
  } catch (error) {
    log.error(error);
    throw Exception.setError(error, false);
  }
}

async function returnCostAfterExpireTime(sellGoodId, goodId) {
  log.info('------returnCostAfterExpireTime----------' + goodId);
  try {
    const setting = await settingService.index();
    if (_.isEqual(_.size(setting), 0)) {
      throw Exception.setError('لطفا تنظیمات را انجام دهید', true);
    }

    if (_.isEqual(_.size(setting), 0)) {
      throw Exception.setError('لطفا تنظیمات را انجام دهید', true);
    }

    const sellGood = await sellGoodService.show(sellGoodId);
    const good = await goodService.show(goodId);

    // user
    const wallet = await showWithUserId(sellGood.userId);
    newWallet = {};
    newWallet.coin = wallet.coin - +(good.price * sellGood.count);
    newWallet.diamond = wallet.diamond + good.priceDiamond * sellGood.count;
    log.info('----if2-newWallet---' + JSON.stringify(newWallet));
    await wallet.update({
      ...wallet, //spread out existing task
      ...newWallet, //spread out body - the differences in the body will over ride the task returned from DB.
    });

    const transaction = {
      type: 0,
      fromUserId: null,
      toUserId: sellGoodService.userId,
      description: `عودت هزینه کالای ${good.title}  به تعداد ${sellGood.count}`,
      amount: good.price * sellGood.count,
      amountDiamond: good.priceDiamond * sellGood.count,
      autoExecute: true,
    };
    log.info('----if2-transaction---' + JSON.stringify(transaction));
    await transactionService.buyTicket(transaction);

    // aduser
    const walletAdUser = await showWithUserId(good.userId);
    newWalletAdUser = {};
    newWalletAdUser.coin = walletAdUser.coin - good.price * sellGood.count;
    newWalletAdUser.diamond =
      walletAdUser.diamond - good.priceDiamond * sellGood.count;
    log.info('----if2-newWallet---' + JSON.stringify(newWalletAdUser));
    await walletAdUser.update({
      ...walletAdUser, //spread out existing task
      ...newWalletAdUser, //spread out body - the differences in the body will over ride the task returned from DB.
    });

    const transactionAdUser = {
      type: 0,
      fromUserId: good.userId,
      toUserId: null,
      description: `عودت هزینه  کالای ${good.title}  به تعداد ${sellGood.count}`,
      amount: good.price * sellGood.count,
      amountDiamond: good.priceDiamond * sellGood.count,
      autoExecute: true,
    };
    log.info(
      '----if2-transactionAdUser---' + JSON.stringify(transactionAdUser)
    );
    await transactionService.buyTicket(transactionAdUser);

    return true;
  } catch (error) {
    log.error(error);
    throw Exception.setError(error, false);
  }
}

async function increaseCashForPrize(prize) {
  log.info('------buyPrize----------' + JSON.stringify(prize));
  log.info(JSON.stringify(prize));
  try {
    const wallet = await showWithUserId(prize.userId);

    // get price for lottery or roulette
    if (_.isEqual(prize.category, 1)) {
      //  lottery
      const lottery = await lotteryService.show(prize.lotteryId);

      newWallet = {};
      newWallet.coin = wallet.coin - lottery.adPriceAfterWin;
      newWallet.diamond = wallet.diamond - lottery.adPriceDiamondAfterWin;
      log.info('----if2-newWallet---' + JSON.stringify(newWallet));
      await wallet.update({
        ...wallet, //spread out existing task
        ...newWallet, //spread out body - the differences in the body will over ride the task returned from DB.
      });

      const transaction = {
        type: 0,
        fromUserId: prize.userId,
        toUserId: null,
        description: 'واریز برنده شدن جایزه',
        amount: +lottery.adPriceAfterWin,
        amountDiamond: +lottery.adPriceDiamondAfterWin,
        autoExecute: true,
      };
      log.info('----if2-transaction---' + JSON.stringify(transaction));
      await transactionService.buyPrize(transaction);
    } else {
      //  roulette
      const roulette = await rouletteService.show(prize.rouletteId);
      log.info('----if3-roulette-1--' + JSON.stringify(roulette));
      newWallet = {};
      newWallet.coin = wallet.coin - roulette.adPriceAfterWin;
      newWallet.diamond = wallet.diamond - roulette.adPriceDiamondAfterWin;
      await wallet.update({
        ...wallet, //spread out existing task
        ...newWallet, //spread out body - the differences in the body will over ride the task returned from DB.
      });
      log.info('----if3-roulette-2--' + JSON.stringify(newWallet));
      const transaction = {
        type: 0,
        fromUserId: prize.userId,
        toUserId: null,
        description: 'واریز  برنده شدن جایزه',
        amount: +roulette.adPriceAfterWin,
        amountDiamond: +roulette.adPriceAfterWin,
        autoExecute: true,
      };
      log.info('----if3-roulette--3-' + JSON.stringify(transaction));
      await transactionService.buyPrize(transaction);
    }

    return true;
  } catch (error) {
    log.error(error);
    throw Exception.setError(error, false);
  }
}

async function decreaseCashForPrizeDaily(prize) {
  log.info('------buyPrize----------' + JSON.stringify(prize));
  log.info(JSON.stringify(prize));
  try {
    const wallet = await showWithUserId(prize.userId);

    log.info('------555----------' + JSON.stringify(wallet));
    if (_.isUndefined(wallet) || _.isEmpty(wallet)) {
      log.info('------if----------' + JSON.stringify(wallet));
      const newWallet = {
        userId: prize.userId,
        coin: 0,
        diamond: 0,
      };
      log.info('--------' + JSON.stringify(newWallet));
      await create(newWallet);

      // throw Exception.setError("موجودی سکه کافی نیست", false);
    }

    // get price for lottery or roulette
    if (_.isEqual(prize.category, 1)) {
      //  lottery
      const lottery = await lotteryService.show(prize.lotteryId);
      log.info('----if2-lottery---' + JSON.stringify(lottery));
      // if (_.lt(wallet.coin, lottery.adPriceForDays))
      //   throw Exception.setError("موجودی سکه کافی نیست", false);

      newWallet = {};
      newWallet.coin = wallet.coin - lottery.adPriceForDays;
      newWallet.diamond = wallet.diamond - lottery.adPriceDiamondForDays;
      log.info('----if2-newWallet---' + JSON.stringify(newWallet));
      await wallet.update({
        ...wallet, //spread out existing task
        ...newWallet, //spread out body - the differences in the body will over ride the task returned from DB.
      });

      const transaction = {
        type: 0,
        fromUserId: prize.userId,
        toUserId: null,
        description: 'کسر هزینه روزانه جایزه',
        amount: -lottery.adPriceForDays,
        autoExecute: true,
      };
      log.info('----if2-transaction---' + JSON.stringify(transaction));
      await transactionService.buyTicket(transaction);
    } else {
      //  roulette
      const roulette = await rouletteService.show(ticket.rouletteId);

      // if (_.lt(wallet.coin, roulette.adPriceAfterWin))
      //   throw Exception.setError("موجودی سکه کافی نیست", false);

      newWallet = {};
      newWallet.coin = wallet.coin - roulette.adPriceAfterWin;
      await wallet.update({
        ...wallet, //spread out existing task
        ...newWallet, //spread out body - the differences in the body will over ride the task returned from DB.
      });

      const transaction = {
        type: 0,
        fromUserId: prize.userId,
        toUserId: null,
        description: 'کسر هزینه روزانه جایزه',
        amount: -roulette.adPriceAfterWin,
        autoExecute: true,
      };

      await transactionService.buyTicket(transaction);
    }

    return true;
  } catch (error) {
    log.error(error);
    throw Exception.setError(error, false);
  }
}

async function update(id, newWallet) {
  try {
    const wallet = await Wallet.findByPk(id);

    if (!wallet) {
      throw Exception.setError('این  کیف پول موجود نمیباشد', true);
    }

    await wallet.update({
      ...wallet, //spread out existing task
      ...newWallet, //spread out body - the differences in the body will over ride the task returned from DB.
    });

    return true;
  } catch (error) {
    log.error(error);
    throw Exception.setError(error, false);
  }
}

async function destroy(id) {
  try {
    const wallet = Wallet.findByPk(id);

    if (!wallet) {
      throw Exception.setError('این کیف پول وجود ندارد', false);
    }

    await wallet.destroy();
    return true;
  } catch (error) {
    log.error(error);
    throw Exception.setError(error, false);
  }
}

module.exports = {
  index,
  create,
  show,
  update,
  charge,
  destroy,
  showWithUserId,
  conversionRatioDiamondToCoin,
  conversionRatioCoinToDiamond,
  transferCash,
  buyTicket,
  buyPrize,
  increaseCashForPrize,
  buyGood,
  decreaseCashForPrizeDaily,
  createCompetition,
  Participation,
  ParticipationGroup,
  conversionRatioDiamondToCash,
  buyTicketForVisitor,
  returnCostAfterExpireTime,
  buyTicketForCompetition,
};

exports.index = index;
exports.create = create;
exports.show = show;
exports.update = update;
exports.charge = charge;
exports.destroy = destroy;
exports.showWithUserId = showWithUserId;
exports.conversionRatioDiamondToCoin = conversionRatioDiamondToCoin;
exports.conversionRatioCoinToDiamond = conversionRatioCoinToDiamond;
exports.transferCash = transferCash;
exports.buyTicket = buyTicket;
exports.buyPrize = buyPrize;
exports.increaseCashForPrize = increaseCashForPrize;
exports.buyGood = buyGood;
exports.decreaseCashForPrizeDaily = decreaseCashForPrizeDaily;
exports.createCompetition = createCompetition;
exports.Participation = Participation;
exports.ParticipationGroup = ParticipationGroup;
exports.conversionRatioDiamondToCash = conversionRatioDiamondToCash;
exports.buyTicketForVisitor = buyTicketForVisitor;
exports.returnCostAfterExpireTime = returnCostAfterExpireTime;
exports.buyTicketForCompetition = buyTicketForCompetition;
