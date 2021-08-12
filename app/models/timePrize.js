'use strict';
module.exports = function (sequelize, DataTypes) {
  const TimePrize = sequelize.define('TimePrize', {
    userId: {
      type: DataTypes.STRING,
      allowNull: false
    },
    runTime: {
      type: DataTypes.TIME,
      allowNull: false
    },
  }, {
    paranoid: true
  });

  TimePrize.associate = (models) => {
    TimePrize.belongsTo(models.Prize, {
      foreignKey: {
        name: 'prizeId',
        allowNull: true
      },
      as: 'prizes'
    });
  };

  return TimePrize;
};