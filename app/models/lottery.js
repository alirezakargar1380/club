'use strict';
module.exports = function (sequelize, DataTypes) {
  const Lottery = sequelize.define('Lottery', {
    title: {
      type: DataTypes.STRING,
      allowNull: false
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false
    },
    image: {
      type: DataTypes.STRING,
      allowNull: false
    },
    online: {
      type: DataTypes.BOOLEAN,
      allowNull: false
    },
    location: {
      type: DataTypes.STRING,
      allowNull: true
    },
    execute: {
      type: DataTypes.BOOLEAN,
      default: false
    },
    runDate: {
      type: DataTypes.DATE,
      allowNull: false
    },
    runTime: {
      type: DataTypes.TIME,
      allowNull: false
    },
    repeat: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    countExecute: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    // for execute time
    lock: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    // price for user
    ticketPrice: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    ticketPriceDiamond: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    //price for register prize
    adPrice: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    adPriceDiamond: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    // price for transfer coin and user for after win
    adPriceAfterWin: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    adPriceDiamondAfterWin: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    // price for Days
    adPriceForDays: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    adPriceDiamondForDays: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    // price for shared field prize
    adPriceShared: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    adPriceDiamondShared: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
  }, {
    paranoid: true
  });

  Lottery.associate = (models) => {
    // Lottery.hasMany(models.Ticket, {
    //   foreignKey: {
    //     name: 'lotteryId',
    //     allowNull: false
    //   },
    //   as: 'tickets'
    // });

    // Lottery.hasMany(models.Prize, {
    //   foreignKey: {
    //     name: 'lotteryId',
    //     allowNull: false
    //   },
    //   as: 'prizes'
    // });

    // Lottery.hasMany(models.Socket, {
    //   foreignKey: {
    //     name: 'lotteryId',
    //     allowNull: true
    //   },
    //   as: 'sockets'
    // });
  };

  return Lottery;
};