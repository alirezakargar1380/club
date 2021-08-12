'use strict';
module.exports = function(sequelize, DataTypes) {
  const CompetitionVisitorPosition = sequelize.define('CompetitionVisitorPosition', {
    position: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    count: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    ticketPrice: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    ticketPriceDiamond: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    userId: {
      type: DataTypes.STRING,
      defaultValue: ''
    },
  }, { 
    paranoid: true
  });

  CompetitionVisitorPosition.associate = (models) => {
    CompetitionVisitorPosition.belongsTo(models.Competition, {
      foreignKey: {
        name: 'competitionId',
        allowNull: true
      },
      as: 'competitions'
    });
  };

  return CompetitionVisitorPosition;
};
