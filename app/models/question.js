'use strict';
module.exports = function (sequelize, DataTypes) {
  const Question = sequelize.define('Question', {
    like: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    disLike: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    //  1 for competition
    // 2 for good
    type: {
      type: DataTypes.STRING,
      default: 1
    },
    userId: {
      type: DataTypes.STRING,
      allowNull: false
    },
    comment: {
      type: DataTypes.STRING,
      allowNull: false
    },
    parentId: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    child: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    updatedBy: {
      type: DataTypes.STRING,
      allowNull: true
    }
  }, {
    paranoid: true
  });

  Question.associate = (models) => {
    Question.belongsTo(models.Competition, {
      foreignKey: {
        name: 'competitionId',
        allowNull: true
      },
      as: 'competitions'
    });

    Question.belongsTo(models.Good, {
      foreignKey: {
        name: 'goodId',
        allowNull: true
      },
      as: 'goods'
    });
  };

  return Question;
};