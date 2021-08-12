'use strict';
module.exports = function (sequelize, DataTypes) {
  const Campain = sequelize.define('Campain', {
    userId: {
      type: DataTypes.STRING,
      allowNull: false
    },
    name: {
      type: DataTypes.STRING,
      allowNull: true
    },
    description: {
      type: DataTypes.STRING,
      allowNull: true
    }
  }, {
    paranoid: true
  });

  Campain.associate = (models) => {
    // Prize.belongsTo(models.Lottery, {
    //   foreignKey: {
    //     name: 'lotteryId',
    //     allowNull: true
    //   },
    //   as: 'prizes'
    // });
  };

  return Campain;
};