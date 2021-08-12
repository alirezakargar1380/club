const _ = require('lodash');
const {
  Image
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
    const image = await Image.findAll({
      // where: {
      //   count: {
      //     [Op.gt]: 0
      //   },
      // }
    })

    return image;
  } catch (error) {
    log.error(error);
    throw Exception.setError(error, false);
  }
}

async function getListImageForGood(goodId) {
  try {
    const image = await Image.findAll({
      where: {
        goodId: goodId
      }
    })

    return image;
  } catch (error) {
    log.error(error);
    throw Exception.setError(error, false);
  }
}

async function create(image) {
  try {
    if (isMain) {
      const listImage = await getListImageForGood(image.goodId);

      for (const image of listImage) {
        await update(image.id, {
          isMain: false
        })
      }

    }

    await Image.create({
      image: image.image,
      userId: image.userId,
      goodId: image.goodId,
      isMain: image.isMain,
      type: 1,
    })

    return true;
  } catch (error) {
    log.error(error);
    throw Exception.setError(error, false);
  }
}


async function setIsMain(imageId) {
  try {
    const image = await show(imageId);
    const listImage = await getListImageForGood(image.goodId);

    for (const image of listImage) {
      if (_.isEqual(image.id, imageId))
        await update(image.id, {
          isMain: true
        })
      else
        await update(image.id, {
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
    var image = await Image.findByPk(id)

    if (!image) {
      throw Exception.setError("این کالا موجود نمیباشد", true);
    }

    return image;
  } catch (error) {
    log.error(error);
    throw Exception.setError(error, false);
  }
}

async function update(id, newImage) {
  try {
    const image = await Image.findByPk(id)

    if (!image) {
      throw Exception.setError("این کالا موجود نمیباشد", true);
    }

    await image.update({
      ...image, //spread out existing task
      ...newImage //spread out body - the differences in the body will over ride the task returned from DB.
    })


    return true;
  } catch (error) {
    log.error(error);
    throw Exception.setError(error, false);
  }
}

async function destroy(id) {
  try {
    const image = Image.findByPk(id)

    if (!image) {
      return res.status(400).json({
        message: 'Good Not Found'
      });
    }

    await image.destroy()

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
  getListImageForGood,
  setIsMain
}