'use strict';
module.exports = function (sequelize, DataTypes) {
  const Rate = sequelize.define('Rate', {
    rate: {
      type: DataTypes.INTEGER,
      allowNull: false
    },

    userId: {
      type: DataTypes.STRING,
      allowNull: false
    }
  }, {
    paranoid: true
  });

  Rate.associate = (models) => {
    Rate.belongsTo(models.Good, {
      foreignKey: {
        name: 'goodId',
        allowNull: true
      },
      as: 'goods'
    });
  };

  return Rate;
};