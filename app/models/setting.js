'use strict';
module.exports = function (sequelize, DataTypes) {
  const Setting = sequelize.define('Setting', {
    countTicket: {
      type: DataTypes.INTEGER,
      defaultValue: 1
    },
    countPrize: {
      type: DataTypes.INTEGER,
      defaultValue: 1
    },
    countSharedPrize: {
      type: DataTypes.INTEGER,
      defaultValue: 1
    },
    countRouletteTicket: {
      type: DataTypes.INTEGER,
      defaultValue: 1
    },
    countRoulettePrize: {
      type: DataTypes.INTEGER,
      defaultValue: 1
    },
    conversionRatioDimondToCoin: {
      type: DataTypes.FLOAT,
      defaultValue: 0.0
    },
    conversionRatioCoinToDimond: {
      type: DataTypes.FLOAT,
      defaultValue: 0.0
    },
    conversionRatioDaimondToCash: {
      type: DataTypes.FLOAT,
      defaultValue: 0.0
    },
    percentFromSell: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    priceForCoin: {
      type: DataTypes.FLOAT,
      defaultValue: 0.0
    },
    priceDiamondForDiamond: {
      type: DataTypes.FLOAT,
      defaultValue: 0.0
    },
    priceForCreateCompetition: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    priceDiamondForCreateCompetition: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    constraintForCharge: {
      type: DataTypes.INTEGER,
      defaultValue: 100
    },
    constraintForChargeDiamond: {
      type: DataTypes.INTEGER,
      defaultValue: 100
    },
    constraintForTransfer: {
      type: DataTypes.INTEGER,
      defaultValue: 100
    },
    constraintForTransferDiamond: {
      type: DataTypes.INTEGER,
      defaultValue: 100
    },
    constraintForSellGood: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    tax: {
      type: DataTypes.INTEGER,
      defaultValue: 9
    },
  }, {
    paranoid: true
  });

  return Setting;
};