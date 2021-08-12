const _ = require('lodash');
const {
    workerData,
    parentPort
} = require('worker_threads');
const moment = require('moment');
const ticket = require('../models/ticket');
const prizeService = require('./prize.service');
const ticketService = require('./ticket.service');
const goodForPrizeService = require('./goodForPrize.service');
const rouletteService = require('./roulette.service');
const walletService = require('./wallet.service')
const winnerService = require('./winner.service')
const timeUtils = require('../utils/time.utiliy');
const good = require('../socket/good');

async function runRoulette(workerData) {
    /////////////////////////create list random from prize
    // console.log('------------workerData--------->', workerData);
    const json = JSON.parse(JSON.stringify(workerData))
    // console.log('------------rouletteId---json------>', json);
    // console.log('------------rouletteId---json------>', json.rouletteId);
    // console.log('------------ticketId-------json-->', json.ticketId);
    var today = moment(new Date()).format('YYYY-MM-DD');
    var date = new Date();
    var current_hour = timeUtils.formatAMPM(date);
    const listPrize = await prizeService.getListPrizeForRouletteWithIdForDayAndTime(json.rouletteId, today, current_hour)
    const roulette = await rouletteService.show(json.rouletteId)
    // console.log('------------listPrize-------json-->', _.size(listPrize));
    // console.log('------------roulette-------roulette-->', roulette);


    let listPrizeArray = [];
    for (const prize of listPrize) {
        // check wallet 
        const wallet = await walletService.showWithUserId(prize.dataValues.userId);

        // check exist prize
        const listGoodForPrize = await goodForPrizeService.listGoodForPrizeWithUserid(prize.dataValues.id, prize.dataValues.userId);
        // console.log('------------5-1--wallet---------', wallet)
        if (prize.dataValues.sequential && _.gt(prize.dataValues.executeNumber, _.size(listGoodForPrize))) {
            continue;
        } else {
            if (_.gt(wallet.dataValues.coin, 0) && _.gt(wallet.dataValues.diamond, 0)) {
                const goodForPrize = await goodForPrizeService.listGoodForPrize(prize.dataValues.id)
                // console.log('------------5--2--goodForPrize--------', goodForPrize)
                if (!_.isEqual(_.size(goodForPrize), 0)) {
                    for (var index = 1; index < _.floor(prize.percentChance); index++)
                        listPrizeArray.push(prize.id)
                }
            }
        }
    }
    // console.log('------------1-->');
    let listPrizeTempArray = [];
    while (_.gt(_.size(listPrizeArray), 0)) {
        const random = Math.floor(Math.random() * _.size(listPrizeArray));
        listPrizeTempArray.push(listPrizeArray[random])
        listPrizeArray.splice(random, 1)
    }
    // console.log('------------2-->');
    listPrizeArray = listPrizeTempArray;
    // console.log('------------listPrizeArray-------listPrizeArray-->', listPrizeArray);
    // ////////////////////////////////////end
    const percentfake = roulette.dataValues.percentFake;
    // console.log('------------percentfake-->', Math.ceil((percentfake * _.size(listPrizeArray)) / 100) + _.size(listPrizeArray));
    let countItem = Math.ceil((percentfake * _.size(listPrizeArray)) / 100) + _.size(listPrizeArray);
    countItem = 100;
    // console.log('------------countItem-------countItem-->', countItem)
    var chanceArray = [true, false];
    let listPrizeItem = [];
    for (let index = 0; index < countItem; index++) {
        if (_.lt((countItem - index - 1), _.size(listPrizeArray))) {
            listPrizeItem.push(listPrizeArray.pop())
        } else {
            const random = Math.floor(Math.random() * chanceArray.length);
            if (chanceArray[random] && !_.isEqual(_.size(listPrizeArray), 0))
                listPrizeItem.push(listPrizeArray.pop())
            else
                listPrizeItem.push(-1)
        }
    }

    const randomPrize = Math.floor(Math.random() * listPrizeItem.length);

    // console.log('--------listPrizeItem--------->', listPrizeItem)
    // console.log('--------randomPrize--------->', randomPrize)
    // console.log('--------listPrizeItem[randomPrize]--------->', listPrizeItem[randomPrize])
    // console.log('--------json.thicketId------->', json.ticketId)
    // console.log('--------5555------>', {
    //     prizeId: listPrizeItem[randomPrize],
    //     used: true
    // })

    let newTicket = {
        used: true
    }
    listPrizeItem[randomPrize] = 2
    const prize = await prizeService.show(listPrizeItem[randomPrize])
    const goodForPrize = await goodForPrizeService.goodForPrizeWithOrder(prize.dataValues.id, prize.dataValues.executeNumber)
    if (_.isNull(goodForPrize))
        listPrizeItem[randomPrize] = -1
    if (_.gt(listPrizeItem[randomPrize], -1)) {
        // console.log('--------if----->')

        // console.log('--------prize----->', prize)
        if (prize.sequential) {
            // console.log('----prize.dataValues.id------->', prize.dataValues.id)
            // console.log('----prize.dataValues.  executeNumber------->', prize.dataValues.executeNumber)
            // console.log('--------5555---prize--->', prize)
            // console.log('--------goodForPrize----->', goodForPrize)
            if (!_.isNull(goodForPrize)) {
                newTicket.prizeId = listPrizeItem[randomPrize];
                newTicket.goodForPrizeId = goodForPrize.dataValues.id;
                // console.log('--------5555---prize--->', prize)
                // console.log('--------newTicket-1---->', newTicket)

                await winnerService.create({
                    userId: prize.userId,
                    ticketId: json.ticketId,
                    prizeId: prize.dataValues.id
                })
            } else {
                newTicket.prizeId = -1;
            }

        } else {
            newTicket.prizeId = listPrizeItem[randomPrize];
            await winnerService.create({
                userId: prize.userId,
                ticketId: json.ticketId,
                prizeId: prize.dataValues.id
            })
        }
        // console.log('--------5555---prize--->', prize)
        // console.log('--------newTicket----->', newTicket)
        // await walletService.increaseCashForPrize(prize);
        // console.log('--------after decreaseCashForPrize--->')
        await prizeService.update(newTicket.prizeId, {
            statusPay: 2,
            executeNumber: prize.dataValues.executeNumber + 1
        })

        // console.log('--------after prizeService.update(--->')
    }
    // console.log('--------before ticketService.update--->')
    await ticketService.update(json.ticketId, newTicket)




    return true

}

runRoulette(workerData)