'use strict';
module.exports = function(sequelize, DataTypes) {
  const CometitionMember = sequelize.define('CometitionMember', {
    userId: {
      type: DataTypes.STRING,
      allowNull: true
    },
    // 1 for win
    // 2 for equel
    // 3 for lost
    win: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
  }, { 
    paranoid: true
  });

  CometitionMember.associate = (models) => {
    CometitionMember.belongsTo(models.Group, {
      foreignKey: {
        name: 'groupId',
        allowNull: true
      },
      as: 'groups'
    });

    CometitionMember.belongsTo(models.Competition, {
      foreignKey: {
        name: 'competitionId',
        allowNull: true
      },
      as: 'competitions'
    });

  };

  return CometitionMember;
};
