const _ = require('lodash');
const {
  success,
  exception,
  error
} = require('../utils/response.utitlity')
const {
  Lottery,
  Setting
} = require('../models')
const competitionService = require('../service/competition.service')
const groupService = require('../service/group.service')
const validate = require('../validations/validator.competition.visitor.ticket.utility')
const competitionVisitorTicketService = require('../service/competitionVisitorTicket.service')
const competitionVisitorPositionService = require('../service/competitionVisitorPosition.service')
const walletService = require('../service/wallet.service');
const competitionVisitorPosition = require('../models/competitionVisitorPosition');

async function index(req, res) {
  try {
    const competitionVisitorTicket = await competitionVisitorTicketService.index()

    return success(res, competitionVisitorTicket);
  } catch (error) {
    return exception(res, error.message);
  }
}

//  req.body.competitionVisitorPositionId,
//  req.body.competitionId,
//  req.body.count
async function create(req, res) {
  try {

    req.body.userId = req.userId

    validate.create(req.body)

    const listTicketForCompetition = await competitionVisitorTicketService.showTicketForCompetitionForPosition({
      competitionVisitorPositionId: req.body.competitionVisitorPositionId,
      competitionId: req.body.competitionId,
    })

    const competitionVisitorPosition = await competitionVisitorPositionService.show(req.body.competitionVisitorPositionId)

    if (_.gt(_.size(listTicketForCompetition) + req.body.count, competitionVisitorPosition.count)) {
      error(res, "این تعداد فضای خالی وجود ندارد")
    }

    const wallet = await walletService.showWithUserId(req.userId)

    if (_.lt(wallet.coin, req.body.count * competitionVisitorPosition.ticketPrice)) {
      error(res, "سکه کافی موجود نمیباشد")
    }

    if (_.lt(wallet.diamond, req.body.count * competitionVisitorPosition.ticketPriceDiamond)) {
      error(res, "سکه کافی موجود نمیباشد")
    }

    await walletService.buyTicketForVisitor({
      daimond: req.body.count * competitionVisitorPosition.ticketPriceDiamond,
      coin: req.body.count * competitionVisitorPosition.ticketPrice,
      userId: req.userId
    })

    for (let index = 0; index < req.body.count; index++)
      await competitionVisitorTicketService.create(
        req.body
      )

    return success(res, {})
  } catch (error) {
    return exception(res, error.message);
  }
}


async function show(req, res) {
  try {
    const competitionVisitorTicket = await competitionVisitorTicketService.show(req.params.id);

    return success(res, competitionVisitorTicket);
  } catch (error) {
    return exception(res, error.message);
  }
}

async function destroy(req, res) {
  try {
    await competitionVisitorTicketService.destroy(req.params.id);

    return success(res, {})

  } catch (error) {
    return exception(res, error.message);
  }

}

module.exports = {
  index,
  create,
  show,
  destroy
}