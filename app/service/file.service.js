const _ = require('lodash');
const {
  File
} = require('../models');
const moment = require('moment');
const {
  Op
} = require('sequelize')
const Exception = require('../utils/error.utility');
const {
  console
} = require('../utils/log.utility');
const log = require('../utils/log.utility')



async function index() {
  try {
    const file = await File.findAll({
      // where: {
      //   count: {
      //     [Op.gt]: 0
      //   },
      // }
    })

    return file;
  } catch (error) {
    log.error(error);
    throw Exception.setError(error, false);
  }
}

async function getListFileForGood(goodId) {
  try {
    const file = await File.findAll({
      where: {
        goodId: goodId
      }
    })

    return file;
  } catch (error) {
    log.error(error);
    throw Exception.setError(error, false);
  }
}

async function getListFileForLottery(lotteryId) {
  try {
    log.info('--getListFileForLottery---lotteryId----->', lotteryId);
    const file = await File.findAll({
      where: {
        lotteryId: lotteryId
      }
    })

    return file;
  } catch (error) {
    log.error(error);
    throw Exception.setError(error, false);
  }
}

async function getListFileForRoulette(rouletteId) {
  try {
    const file = await File.findAll({
      where: {
        rouletteId: rouletteId
      }
    })

    return file;
  } catch (error) {
    log.error(error);
    throw Exception.setError(error, false);
  }
}

async function getListFileForCompetition(competitionId) {
  try {
    const file = await File.findAll({
      where: {
        competitionId: competitionId
      }
    })

    return file;
  } catch (error) {
    log.error(error);
    throw Exception.setError(error, false);
  }
}

async function getListFileForWallet(walletId) {
  try {
    const file = await File.findAll({
      where: {
        walletId: walletId
      }
    })

    return file;
  } catch (error) {
    log.error(error);
    throw Exception.setError(error, false);
  }
}

async function create(file) {
  try {
    // check exist new ismain
    existIsMain = false;
    file.file.forEach(element => {
      if (element.isMain)
      if (element.name.match(/\.(jpg|JPG|jpeg|JPEG|png|PNG|gif|GIF)$/)) {
        existIsMain = true;
      }
      else{
        throw Exception.setError("نمیتوانید این فایل را به عنوان تصویر اصلی مشخص کنید.", true);
      }
    });
    // reset ismain for old file
    if (existIsMain) {
      let listFile = []
      if (_.isEqual(file.type, 1))
      listFile = await getListFileForGood(file.goodId);

      if (_.isEqual(file.type, 2))
      listFile = await getListFileForLottery(file.lotteryId);

      if (_.isEqual(file.type, 3))
      listFile = await getListFileForRoulette(file.rouletteId);

      if (_.isEqual(file.type, 4))
      listFile = await getListFileForCompetition(file.competitionId);

      for (const fileItem of listFile) {
        await update(fileItem.id, {
          isMain: false
        })
      }
    }

    let newFile = {
      userId: file.userId,
      type: file.type,
    }

    if (_.isEqual(file.type, 1))
    newFile.goodId = file.goodId

    if (_.isEqual(file.type, 2))
    newFile.lotteryId = file.lotteryId

    if (_.isEqual(file.type, 3))
    newFile.rouletteId = file.rouletteId

    if (_.isEqual(file.type, 4))
    newFile.competitionId = file.competitionId

    if (_.isEqual(file.type, 5))
    newFile.walletId = file.walletId
    for (const fileItem of file.file) {
      newFile.file = fileItem.name;
      newFile.isMain = fileItem.isMain;
      newFile.description = fileItem.description;

      await File.create(newFile)
    }

    return true;
  } catch (error) {
    log.error(error);
    throw Exception.setError(error, false);
  }
}


async function setIsMain(fileId) {
  try {
    log.info('-------setIsMain-----fileId------->' + fileId)
    const file = await show(fileId);
    log.info('-------file------->' + JSON.stringify(file))
    if (file.file.match(/\.(jpg|JPG|jpeg|JPEG|png|PNG|gif|GIF)$/)) {
      existIsMain = true;
    }
    else{
      throw Exception.setError("نمیتوانید این فایل را به عنوان تصویر اصلی مشخص کنید.", true);
    }
    log.info('-------file.type-----file.type------->' + file.type)
    let listFile = []
    if (_.isEqual(file.type, 1))
    listFile = await getListFileForGood(file.goodId);

    if (_.isEqual(file.type, 2))
    listFile = await getListFileForLottery(file.lotteryId);

    if (_.isEqual(file.type, 3))
    listFile = await getListFileForRoulette(file.rouletteId);

    if (_.isEqual(file.type, 4))
    listFile = await getListFileForCompetition(file.competitionId)

    for (const fileItem of listFile) {
      if (_.isEqual(fileItem.id, fileId))
        await update(fileItem.id, {
          isMain: true
        })
      else
        await update(fileItem.id, {
          isMain: false
        })
    }


    return true;
  } catch (error) {
    log.error(error);
    throw Exception.setError(error, false);
  }
}

async function show(id) {
  try {
    var file = await File.findByPk(id)

    if (!file) {
      throw Exception.setError("این کالا موجود نمیباشد", true);
    }

    return file;
  } catch (error) {
    log.error(error);
    throw Exception.setError(error, false);
  }
}

async function update(id, newFile) {
  try {
    const file = await File.findByPk(id)

    if (!file) {
      throw Exception.setError("این فایل موجود نمیباشد", true);
    }

    await file.update({
      ...file, //spread out existing task
      ...newFile //spread out body - the differences in the body will over ride the task returned from DB.
    })


    return true;
  } catch (error) {
    log.error(error);
    throw Exception.setError(error, false);
  }
}

async function destroy(id) {
  try {
    const file = File.findByPk(id)

    if (!file) {
      return res.status(400).json({
        message: 'Good Not Found'
      });
    }

    await file.destroy()

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
  destroy,
  getListFileForGood,
  getListFileForLottery,
  getListFileForRoulette,
  getListFileForCompetition,
  getListFileForWallet,
  setIsMain
}