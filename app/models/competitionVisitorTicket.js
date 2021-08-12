'use strict';
module.exports = function(sequelize, DataTypes) {
  const competitionVisitorTicket = sequelize.define('competitionVisitorTicket', {
    userId: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  }, { 
    paranoid: true
  });

  competitionVisitorTicket.associate = (models) => {
    competitionVisitorTicket.belongsTo(models.CompetitionVisitorPosition, {
      foreignKey: {
        name: 'competitionVisitorPositionId',
        allowNull: true
      },
      as: 'competitionVisitorPositions'
    });

    competitionVisitorTicket.belongsTo(models.Competition, {
      foreignKey: {
        name: 'competitionId',
        allowNull: true
      },
      as: 'competitions'
    });
  };

  return competitionVisitorTicket;
};
