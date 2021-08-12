'use strict';
module.exports = function(sequelize, DataTypes) {
  const Socket = sequelize.define('Socket', {
    userId: {
      type: DataTypes.STRING,
      allowNull: false
    },
    socketId: {
      type: DataTypes.STRING,
      allowNull: false
    },
    role: {
      type: DataTypes.STRING,
      allowNull: false
    },
  }, {
    paranoid: true
  });

  Socket.associate = (models) => {
    // Socket.belongsTo(models.Lottery, {
    //   foreignKey: {
    //     name: 'lotteryId',
    //     allowNull: true
    //   },
    //   as: 'sockets'
    // });
  };

  return Socket;
};
