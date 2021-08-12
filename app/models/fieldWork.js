'use strict';
module.exports = function(sequelize, DataTypes) {
  const FieldWork = sequelize.define('FieldWork', {
    title: {
      type: DataTypes.STRING,
      allowNull: false
    },
  }, {
    paranoid: true
  });

  FieldWork.associate = (models) => {
    // Prize.belongsTo(models.Lottery, {
    //   foreignKey: {
    //     name: 'lotteryId',
    //     allowNull: true
    //   },
    //   as: 'prizes'
    // });
  };

  return FieldWork;
};
