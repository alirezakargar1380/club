'use strict';
module.exports = function(sequelize, DataTypes) {
  const TicketMessage = sequelize.define('TicketMessage', {
    subject: {
      type: DataTypes.STRING,
      allowNull: true
    },
    description: {
      type: DataTypes.STRING,
      allowNull: true
    },
     // 0 high
     // 1 medium
     // 2 low
    priority: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    // 0 for todo
    // 1 for inprogress
    // 0 for done
    state: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    userId: {
      type: DataTypes.STRING,
      allowNull: true
    },
  }, { 
    paranoid: true
  });

  TicketMessage.associate = (models) => {
    // Message.belongsTo(models.Group, {
    //   foreignKey: {
    //     name: 'groupId',
    //     allowNull: true
    //   },
    //   as: 'groups'
    // });

    // Message.belongsTo(models.Competition, {
    //   foreignKey: {
    //     name: 'competitionId',
    //     allowNull: true
    //   },
    //   as: 'competitions'
    // });

  };

  return TicketMessage;
};
