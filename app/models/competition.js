'use strict';
module.exports = function (sequelize, DataTypes) {
  const Competition = sequelize.define(
    'Competition',
    {
      userId: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      title: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      description: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      runDate: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      runTime: {
        type: DataTypes.TIME,
        allowNull: false,
      },
      // 0 for one group
      // 1 for group tree
      // 2 for group duel in this type groups  rivaliser with together par paire
      // 3 for group competition
      type: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      countGroup: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      countMember: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      countWinner: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      parent: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      priceForUser: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
      priceDiamondForUser: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
      priceGroupForUser: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
      priceGroupDiamondForUser: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
      metaData: {
        type: DataTypes.STRING,
        defaultValue: '',
      },
      prizeExist: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      city: {
        type: DataTypes.STRING,
        defaultValue: '',
      },
    },
    {
      paranoid: true,
    }
  );

  Competition.associate = (models) => {
    Competition.belongsTo(models.Campain, {
      foreignKey: {
        name: 'campainId',
        allowNull: true,
      },
      as: 'campains',
    });
  };

  return Competition;
};
