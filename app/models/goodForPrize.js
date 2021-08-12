'use strict';
module.exports = function(sequelize, DataTypes) {
  const GoodForPrize = sequelize.define('GoodForPrize', {
    userId: {
      type: DataTypes.STRING,
      allowNull: false
    },
    description: {
      type: DataTypes.STRING,
      allowNull: true
    },
    order: {
      type: DataTypes.INTEGER,
      defaultValue: 1
    },
  }, {
    paranoid: true
  });

  GoodForPrize.associate = (models) => {
    GoodForPrize.belongsTo(models.Good, {
      foreignKey: {
        name: 'goodId',
        allowNull: true
      },
      as: 'goods'
    });

    GoodForPrize.belongsTo(models.Prize, {
      foreignKey: {
        name: 'prizeId',
        allowNull: true
      },
      as: 'prizes'
    });
  };

  return GoodForPrize;
};
