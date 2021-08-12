const _ = require('lodash');
const {
    workerData,
    parentPort
} = require('worker_threads');
const moment = require('moment');
const ticket = require('../models/ticket');
const goodForPrizeService = require('./goodForPrize.service');
const prizeService = require('./prize.service');
const ticketService = require('./ticket.service');
const lotteryService = require('./lottery.service');
const walletService = require('./wallet.service');
const winnerService = require('./winner.service');

async function runLottery(lotteryId) {

    try {
        // console.log('------------1-----------')
        //  lock lottery
        await lotteryService.update(lotteryId, {
            lock: true
        });

        // console.log('------------2-----------')
        const lottery = await lotteryService.show(lotteryId)
        // console.log('------------3-----------')
        const listPrize = await prizeService.getListPrizeForLotteryWithIdForThisExecute(lotteryId, lottery.countExecute)
        // console.log('------------4-----------')
        const listTicket = await ticketService.getListTicketWithLotteryId(lotteryId)
        // console.log('------------5-----------')
        // create list from ticket
        let listTicketItemIDs = [];
        listTicket.forEach(element => {
            listTicketItemIDs.push(element.dataValues.id)
        });
        // console.log('-----------listPrize----------', listPrize)
        // create list from prize
        let listPizeItem = [];
        let listFieldWorkTemp = [];
        // listPrize.forEach(async (prize) => {
        for (const prize of listPrize) {
            // check wallet 
            const wallet = await walletService.showWithUserId(prize.dataValues.userId)
            // console.log('------------5-1--wallet---------', wallet)
            if (_.gt(wallet.dataValues.coin, 0) && _.gt(wallet.dataValues.diamond, 0)) {
                const goodForPrize = await goodForPrizeService.listGoodForPrize(prize.dataValues.id)
                // console.log('------------5--2--goodForPrize--------', goodForPrize)
                if (_.isEqual(_.size(goodForPrize), 0)) {
                    // console.log('------------5--2----------')
                    await prizeService.update(prize.dataValues.id, {
                        statusPay: 3,
                    })
                } else {
                    if (prize.dataValues.multiOwnerPrize) {
                        if (!_.includes(listFieldWorkTemp, prize.dataValues.fieldWorkId)) {
                            let tempListForPrizeId = []
                            listFieldWorkTemp.push(prize.dataValues.fieldWorkId)
                            // console.log('------------5--3----------')
                            listPrize.forEach(prize1 => {
                                // console.log('------------5--4---1------', prize1.dataValues.fieldWorkId)
                                // console.log('------------5--4---1------',typeof prize1.dataValues.fieldWorkId)
                                // console.log('------------5--4---2------', prize.dataValues.fieldWorkId)
                                // console.log('------------5--4---2------',typeof prize.dataValues.fieldWorkId)
                                // console.log('------------5--4----3-----', prize1.dataValues.multiOwnerPrize)
                                // console.log('------------5--4----3-----',typeof prize1.dataValues.multiOwnerPrize)
                                // console.log('------------5--4----3-----',_.isEqual(prize1.dataValues.fieldWorkId, prize.dataValues.fieldWorkId))
                                // console.log('------------5--4----3-----',_.isEqual(prize1.dataValues.multiOwnerPriz , true))
                                if (_.isEqual(prize1.dataValues.fieldWorkId, prize.dataValues.fieldWorkId) && _.isEqual(prize1.dataValues.multiOwnerPrize , true)) {
                                    // console.log('if true');
                                    tempListForPrizeId.push(prize1.dataValues.id)
                                }
                            });
                            // console.log('------------tempListForPrizeId-----',tempListForPrizeId)
                            listPizeItem.push(tempListForPrizeId)
                        }
                    } else {
                        // console.log('------------5--5---------')
                        listPizeItem.push([prize.dataValues.id])
                    }
                }
            }
        }
        // console.log('-----------listPizeItem----------', listPizeItem)
        // create list from winner
        winnerTicket = []
        winnerTicketIds = []
        for (const prizeList of listPizeItem) {
            const random = Math.floor(Math.random() * listTicketItemIDs.length);

            winnerTicket.push({
                ticketId: listTicketItemIDs[random],
                prizeList: prizeList
            })

            winnerTicketIds.push(listTicketItemIDs[random])
            listTicketItemIDs.splice(random, 1)
            // console.log(random, listTicketItemIDs[random]);
        }

        // console.log('------------6----winnerTicket-------', winnerTicket)
        // update ticket and prize
        for (const ticket of listTicket) {
            let newTicket = {}
            if (_.includes(winnerTicketIds, ticket.dataValues.id)) {
                // console.log('------------7-----------')
                for (const winticket of winnerTicket) {
                    if (_.isEqual(winticket.ticketId, ticket.dataValues.id)) {
                        // newTicket.prizeId = winnerticket.prizeId;
                        for (const prizeId of winticket.prizeList) {
                            const prize = await prizeService.show(prizeId)
                            // await walletService.decreaseCashForPrize(prize.dataValues);

                            await prizeService.update(prizeId, {
                                statusPay: 2,
                            })

                            await winnerService.create({
                                userId: prize.userId,
                                ticketId: ticket.dataValues.id,
                                prizeId: prizeId
                            })
                        }
                    }
                }

            }
            newTicket.used = true;

            await ticketService.update(ticket.dataValues.id, newTicket);

        }
        // update lottery
        // console.log('------------8-----------')
        newLottery = {
            execute: false,
            lock: false,
            countExecute: lottery.countExecute + 1
        }

        if (_.isEqual(lottery.countExecute + 1, lottery.repeat))
            newLottery.execute = true
        // console.log('------------9-----------')
        await lotteryService.update(lotteryId, newLottery);
        // console.log('------------10-----------')
        parentPort.postMessage({
            fileName: lotteryId,
            status: 'Done'
        })
    } catch (error) {
        log.error('----===========' + error);
        parentPort.postMessage({
            fileName: lotteryId,
            status: 'error'
        })
    }
}

runLottery(workerData)