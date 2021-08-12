'use strict';
module.exports = function (sequelize, DataTypes) {
  const Comment = sequelize.define('Comment', {
    // 1 for lottery
    // 2 for roulette
    // 3 for competition
    // 4 for good
    // 5 for prize
    type: {
      type: DataTypes.STRING,
      allowNull: false
    },
    // this code for use by user  and  deposit coin and diamond for ad user
    comment: {
      type: DataTypes.STRING,
      allowNull: false
    },

    userId: {
      type: DataTypes.STRING,
      allowNull: false
    },
    updatedBy: {
      type: DataTypes.STRING,
      allowNull: true
    }
  }, {
    paranoid: true
  });

  Comment.associate = (models) => {
    Comment.belongsTo(models.Prize, {
      foreignKey: {
        name: 'prizeId',
        allowNull: true
      },
      as: 'prizes'
    });

    Comment.belongsTo(models.Lottery, {
      foreignKey: {
        name: 'lotteryId',
        allowNull: true
      },
      as: 'lotterys'
    });

    Comment.belongsTo(models.Roulette, {
      foreignKey: {
        name: 'rouletteId',
        allowNull: true
      },
      as: 'roulettes'
    });

    Comment.belongsTo(models.Competition, {
      foreignKey: {
        name: 'competitionId',
        allowNull: true
      },
      as: 'competitions'
    });

    Comment.belongsTo(models.Good, {
      foreignKey: {
        name: 'goodId',
        allowNull: true
      },
      as: 'goods'
    });
  };

  return Comment;
};