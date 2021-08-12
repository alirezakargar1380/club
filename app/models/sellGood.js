'use strict';
module.exports = function(sequelize, DataTypes) {
  const SellGood = sequelize.define('SellGood', {
    userId: {
      type: DataTypes.STRING,
      allowNull: false
    },
    count: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    // 1 for sell
    // 2 for send good
    // 3 for return cost to user
    status: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 1
    },
  }, {
    paranoid: true
  });

  SellGood.associate = (models) => {
    SellGood.belongsTo(models.Good, {
      foreignKey: {
        name: 'goodId',
        allowNull: true
      },
      as: 'goods'
    });
  };

  return SellGood;
};
