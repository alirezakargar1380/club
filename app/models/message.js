'use strict';
module.exports = function(sequelize, DataTypes) {
  const Message = sequelize.define('Message', {
    userId: {
      type: DataTypes.STRING,
      allowNull: false
    },
    isAnswer: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    message: {
      type: DataTypes.STRING,
      defaultValue: true
    },
  }, { 
    paranoid: true
  });

  Message.associate = (models) => {
    Message.belongsTo(models.TicketMessage, {
      foreignKey: {
        name: 'ticketMessageId',
        allowNull: false
      },
      as: 'ticketMessages'
    });

    // Message.belongsTo(models.Competition, {
    //   foreignKey: {
    //     name: 'competitionId',
    //     allowNull: true
    //   },
    //   as: 'competitions'
    // });

  };

  return Message;
};
