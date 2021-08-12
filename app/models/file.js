'use strict';
module.exports = function (sequelize, DataTypes) {
  const File = sequelize.define('File', {
    file: {
      type: DataTypes.STRING,
      allowNull: false
    },
    // 1 for good
    // 2 for lottery
    // 3 for roulette
    // 4 for competition
    type: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1
    },
    userId: {
      type: DataTypes.STRING,
      allowNull: false
    },
    isMain: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    description: {
      type: DataTypes.STRING,
      defaultValue: false
    }
  }, {
    paranoid: true
  });

  File.associate = (models) => {
    File.belongsTo(models.Good, {
      foreignKey: {
        name: 'goodId',
        allowNull: true
      },
      as: 'goods'
    });

    File.belongsTo(models.Competition, {
      foreignKey: {
        name: 'competitionId',
        allowNull: true
      },
      as: 'competitions'
    });

    File.belongsTo(models.Lottery, {
      foreignKey: {
        name: 'lotteryId',
        allowNull: true
      },
      as: 'lotterys'
    });

    File.belongsTo(models.Roulette, {
      foreignKey: {
        name: 'rouletteId',
        allowNull: true
      },
      as: 'roulettes'
    });

    File.belongsTo(models.Wallet, {
      foreignKey: {
        name: 'walletId',
        allowNull: true
      },
      as: 'wallets'
    });
  };

  return File;
};