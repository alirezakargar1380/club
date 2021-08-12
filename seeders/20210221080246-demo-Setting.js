'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */ 
   return queryInterface.bulkInsert('Settings', [{
    countTicket: 1,
    countPrize: 1,
    countSharedPrize: 1,
    countRouletteTicket: 6,
    countRoulettePrize: 6,
    conversionRatioDimondToCoin: 2,
    conversionRatioCoinToDimond: 2,
    conversionRatioDaimondToCash: 2,
    percentFromSell: 20,
    priceForCoin: 20.5,
    priceDiamondForDiamond: 20.5,
    priceForCreateCompetition: 20,
    priceDiamondForCreateCompetition: 20,
    constraintForCharge: 220000000,
    constraintForChargeDiamond: 220000000,
    constraintForTransfer: 300000000,
    constraintForTransferDiamond: 300000000,
    tax: 9,
    constraintForSellGood: 3,
    createdAt: Sequelize.literal('NOW()'),
    updatedAt: Sequelize.literal('NOW()'),
  }], {});
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  }
};
