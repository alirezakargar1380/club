const _ = require('lodash');
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const path = require('path');
const server = require('http').createServer(app);
const io = require('socket.io')(server, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
  },
});
const cron = require('node-cron');
const request = require('request');
const moment = require('moment');
const xXssProtection = require('x-xss-protection');

const upload = require('./app/utils/multer.utitlity');
const log = require('./app/utils/log.utility');

const lotteryThread = require('./app/service/lottery.thread.service');
const rouletteThread = require('./app/service/roulette.thread.service');
const lotteryService = require('./app/service/lottery.service');
const rouletteService = require('./app/service/roulette.service');
const prizeService = require('./app/service/prize.service');
const socketService = require('./app/service/socket.service');
const ticketService = require('./app/service/ticket.service');
const authService = require('./app/service/auth.service');
const walletService = require('./app/service/wallet.service');
const mailService = require('./app/service/mail.service');

const setting = require('./app/routes/setting');
const competition = require('./app/routes/competition');
const competitionMember = require('./app/routes/competitionMember');
const group = require('./app/routes/group');
const wallet = require('./app/routes/wallet');
const transaction = require('./app/routes/transaction');
const good = require('./app/routes/good');
const sellGood = require('./app/routes/sellGood');
const test = require('./app/routes/test');
const report = require('./app/routes/report');
const comment = require('./app/routes/comment');
const question = require('./app/routes/question');
const goodForPrize = require('./app/routes/goodForPrize');
const winner = require('./app/routes/winner');
const news = require('./app/routes/news');
const file = require('./app/routes/file');
const mail = require('./app/routes/mail');
const message = require('./app/routes/message');
const ticketMessage = require('./app/routes/ticketMessage');
const prizeForCompetition = require('./app/routes/prizeForCompetition');
const competitionVisitorPosition = require('./app/routes/competitionVisitorPosition');
const competitionVisitorTicket = require('./app/routes/competitionVisitorTicket');
const compain = require('./app/routes/campain');
const team = require('./app/routes/team');
const lottery = require('./app/routes/lottery');
const prize = require('./app/routes/prize');
const roulette = require('./app/routes/roulette');
const ticket = require('./app/routes/ticket');

// Add headers
app.use(function (req, res, next) {
  // Website you wish to allow to connect
  res.header('Access-Control-Allow-Origin', '*');

  // Request methods you wish to allow
  res.header(
    'Access-Control-Allow-Methods',
    'GET, POST, OPTIONS, PUT, PATCH, DELETE'
  );

  // Request headers you wish to allow
  res.header('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

  // Set to true if you need the website to include cookies in the requests sent
  // to the API (e.g. in case you use sessions)
  res.header('Access-Control-Allow-Credentials', true);

  // Pass to next layer of middleware
  next();
});

// Set "X-XSS-Protection: 0"
app.use(xXssProtection());
app.use(cors());

const { error } = require('./app/utils/response.utitlity');

const { mainSocketService } = require('./mainSocketService');
app.use((req, res, next) => {
  try {
    //  console.log('-----req.url------->', req.url)
    //  console.log('-----req.method------->', req.url.indexOf("authService"))
    //  console.log(req.url.substring(12, req.url.length))
    if (_.gt(req.url.indexOf('authService'), -1)) {
      //  console.log('------authService-------------->')
      //  console.log(req.url.substring(12, req.url.length))
      const url = req.url.substring(12, req.url.length);
      req.headers['service'] = 'shid_club';
      switch (req.method) {
        case 'POST':
          req
            .pipe(request.post('https://auth-shid.iran.liara.run' + url))
            .pipe(res);
          break;
        case 'GET':
          req
            .pipe(request.get('https://auth-shid.iran.liara.run' + url))
            .pipe(res);
          break;
        case 'PUT':
          req
            .pipe(request.put('https://auth-shid.iran.liara.run' + url))
            .pipe(res);
          break;
        case 'DELETE':
          req
            .pipe(request.delete('https://auth-shid.iran.liara.run' + url))
            .pipe(res);
          break;
        default:
          req
            .pipe(request.post('https://auth-shid.iran.liara.run' + url))
            .pipe(res);
      }
    } else next();
  } catch (err) {
    error(res, err.message);
  }
});

app.use(express.static(path.join(__dirname, 'public')));
app.use(
  '/public/upload',
  express.static(path.join(__dirname, 'public/upload'))
);

// parse requests of content-type - application/json
app.use(bodyParser.json());

// check tocken
app.use(authService.verifyToken);
// upload file
app.use(upload.array('file', 12));
app.post('/upload', upload.array('file', 12), (req, res) => {
  //  console.log('----upload------>', req.file);
  //  console.log('----files------>', req.file);
  res.send(req.file);
});

// parse requests of content-type - application/x-www-form-urlencoded
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

const db = require('./app/models');
const { console } = require('./app/utils/log.utility');
const campain = require('./app/models/campain');

db.sequelize.sync();
// // drop the table if it already exists
// db.sequelize.sync({ force: true }).then(() => {
// //  console.log("Drop and re-sync db.");
// });

// route
app.use('/setting', setting);
app.use('/competition', competition);
app.use('/competitionMember', competitionMember);
app.use('/group', group);
app.use('/wallet', wallet);
app.use('/transaction', transaction);
app.use('/goodForPrize', goodForPrize);
app.use('/good', good);
app.use('/file', file);
app.use('/sellGood', sellGood);
app.use('/report', report);
app.use('/comment', comment);
app.use('/question', question);
app.use('/winner', winner);
app.use('/news', news);
app.use('/mail', mail);
app.use('/message', message);
app.use('/ticketMessage', ticketMessage);
app.use('/prizeForCompetition', prizeForCompetition);
app.use('/competitionVisitorPosition', competitionVisitorPosition);
app.use('/competitionVisitorTicket', competitionVisitorTicket);
app.use('/compain', compain);
app.use('/team', team);
app.use('/lottery', lottery);
app.use('/prize', prize);
app.use('/roulette', roulette);
app.use('/ticket', ticket);

// app.get('*', (request, response) => {
//   response.sendFile(`${__dirname}/public/index.html`);
// });
// job for run lottery and ...
cron.schedule('0 1-59/1 * * * *', async () => {
  log.info('------per one minute-------');
  // send email
  const mailList = await mailService.getMailList();
  let mails = [];
  for (const mail of mailList) {
    mails.push({
      id: mail.id,
      email: mail.email,
      text: mail.text,
      subject: mail.subject,
    });
  }
  const resultSend = await mailService.send(mails);
  log.info('------resultSend------->' + JSON.stringify(resultSend));

  // offline lottery
  const executeOfflineLotteryList = await lotteryService.listRunOfflineLottery();
  if (_.size(executeOfflineLotteryList)) {
    executeOfflineLotteryList.forEach(async (lottery) => {
      newLottery = {
        execute: false,
        lock: false,
        countExecute: lottery.countExecute + 1,
      };

      if (_.isEqual(lottery.countExecute + 1, lottery.repeat))
        newLottery.execute = true;
      //  console.log('------------9-----------')
      await lotteryService.update(lottery.id, newLottery);

      // const lotterys = await lotteryService.index();
      // io.sockets.emit('getLoteries', socketSuccess(lotterys));
    });
  }

  //online lottery
  const executeLotteryList = await lotteryService.listRunLottery();
  if (_.size(executeLotteryList)) {
    executeLotteryList.forEach(async (element) => {
      // run worker
      //  console.log('-----1------>')
      await lotteryThread.run(element.dataValues.id);
      //  console.log('-----2------>')
      const lotterys = await lotteryService.index();
      //  console.log('-----3------>')
      //io.sockets.emit('getLoteries', socketSuccess(lotterys));
      const tickets = await ticketService.getAllListTicketWithLotteryId(
        element.dataValues.id
      );
      //  console.log('-----4------>')
      await _.forEach(tickets, async (ticket) => {
        const socket = await socketService.checkExist(ticket.userId);
        //  console.log('-----5------>')
        const userTickets = await ticketService.getListTicketWithLotteryIdAndUserId(
          element.dataValues.id,
          ticket.userId
        );
        if (!_.isEqual(_.size(socket), 0)) {
          //io.to(socket.socketId).emit('getTickets', socketSuccess(userTickets));
        }
      });
      //  console.log('-----6------>')
    });
  }
});

cron.schedule('0 0 1-31/1 * *', async () => {
  // cron.schedule('0 1-59/3 * * * *', async () => {
  //  console.log('running a task every twenty hours');
  const listLotteryForDeacreasePriceDaily = await lotteryService.listLotteryForDeacreasePriceDaily();
  // console.log('-------listLotteryForDeacreasePriceDaily------>' ,listLotteryForDeacreasePriceDaily);
  const listRoulette = await rouletteService.index();
  // console.log('-------listRoulette------>' ,listRoulette);
  if (_.size(listLotteryForDeacreasePriceDaily)) {
    _.forEach(listLotteryForDeacreasePriceDaily, async (lottery) => {
      const listPrizeArray = await prizeService.getListPrizeForLotteryWithIdNotExecue(
        lottery.id
      );
      _.forEach(listPrizeArray, async (prize) => {
        await walletService.decreaseCashForPrizeDaily(prize);
      });
    });
  }

  if (_.size(listRoulette)) {
    _.forEach(listRoulette, async (roulette) => {
      const listPrizeArray = await prizeService.getListPrizeForRouletteWithId(
        roulette.id
      );
      _.forEach(listPrizeArray, async (prize) => {
        await walletService.decreaseCashForPrizeDaily(prize);
      });
    });
  }
});

// set port, listen for requests
const PORT = process.env.PORT || 3000;
server.listen(PORT, async () => {
  log.info(`Server is running on port ${PORT}.`);
});

//start socket service
//mainSocketService(io);
