'use strict';
module.exports = function(sequelize, DataTypes) {
  const Transaction = sequelize.define('Transaction', {
    fromUserId: {
      type: DataTypes.STRING,
      allowNull: true
    },
    toUserId: {
      type: DataTypes.STRING,
      allowNull: true
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false
    },
    confirmedBy: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    denayBy: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    amount: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    amountDiamond: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    // 0 for coin
    // 1 for diamond
    // 2 for ticket
    type: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    autoExecute: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },
  }, { 
    paranoid: true
  });

  Transaction.associate = (models) => {
    Transaction.belongsTo(models.Ticket, {
      foreignKey: {
        name: 'ticketId',
        allowNull: true
      },
      as: 'tickets'
    });
  };

  return Transaction;
};
