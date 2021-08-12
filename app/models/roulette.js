'use strict';
module.exports = function (sequelize, DataTypes) {
  const Roulette = sequelize.define('Roulette', {
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
    percentFake: {
      type: DataTypes.INTEGER,
      defaultValue: 30
    },
    ticketPrice: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    ticketPriceDiamond: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    adPrice: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    adPriceDiamond: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    adPriceAfterWin: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    adPriceDiamondAfterWin: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    adPriceForDays: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    adPriceDiamondForDays: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    fromDate: {
      type: DataTypes.DATE,
      allowNull: false
    },
    countDay: {
      type: DataTypes.INTEGER,
      defaultValue: 1
    },
  }, {
    paranoid: true
  });

  Roulette.associate = (models) => {
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

  return Roulette;
};