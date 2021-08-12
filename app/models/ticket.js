'use strict';
module.exports = (sequelize, DataTypes) => {
  const Ticket = sequelize.define('Ticket', {
    title: {
      type: DataTypes.STRING,
      allowNull: false
    },
    description: {
      type: DataTypes.STRING,
     allowNull: false
    },
    order: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    // 1 for lottery
    // 2 for roulette
    category: {
      type: DataTypes.INTEGER,
      defaultValue: 1
    },
    userId: {
      type: DataTypes.STRING,
      allowNull: false
    },
    used: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  }, {
    paranoid: true
  });

  Ticket.associate = (models) => {
    Ticket.belongsTo(models.Lottery, {
      foreignKey: {
        name: 'lotteryId',
        allowNull: true
      },
      as: 'tickets'
    });

    Ticket.belongsTo(models.Roulette, {
      foreignKey: {
        name: 'rouletteId',
        allowNull: true
      },
      as: 'rouletteTickets'
    });

    Ticket.belongsTo(models.Prize, {
      foreignKey: {
        name: 'prizeId',
        allowNull: true
      },
      as: 'prizes'
    });

    Ticket.belongsTo(models.GoodForPrize, {
      foreignKey: {
        name: 'goodForPrizeId',
        allowNull: true
      },
      as: 'goodForPrizes'
    });
  };

  return Ticket;
};
