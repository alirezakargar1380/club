'use strict';
module.exports = function (sequelize, DataTypes) {
  const Winner = sequelize.define('Winner', {
    used: {
      type: DataTypes.BOOLEAN,
      allowNull: false
    },
    // this code for use by user  and  deposit coin and diamond for ad user
    code: {
      type: DataTypes.STRING,
      allowNull: false
    },

    userId: {
      type: DataTypes.STRING,
      allowNull: false
    }
  }, {
    paranoid: true
  });

  Winner.associate = (models) => {
    Winner.belongsTo(models.Prize, {
      foreignKey: {
        name: 'prizeId',
        allowNull: true
      },
      as: 'prizes'
    });

    Winner.belongsTo(models.Ticket, {
      foreignKey: {
        name: 'ticketId',
        allowNull: true
      },
      as: 'tickets'
    });

    Winner.belongsTo(models.GoodForPrize, {
      foreignKey: {
        name: 'goodForPrizeId',
        allowNull: true
      },
      as: 'goodForPrizes'
    });
  };

  return Winner;
};