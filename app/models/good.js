'use strict';
module.exports = function (sequelize, DataTypes) {
  const Good = sequelize.define('Good', {
    userId: {
      type: DataTypes.STRING,
      allowNull: false
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false
    },
    description: {
      type: DataTypes.STRING,
      allowNull: true
    },
    image: {
      type: DataTypes.STRING,
      allowNull: true
    },
    price: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    priceDiamond: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    priceOfToman: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    count: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    rate: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    // 1 for prize 
    // 2 for sell
    type: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    expireDay: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    }
  }, {
    paranoid: true
  });

  Good.associate = (models) => {
    // Socket.belongsTo(models.Lottery, {
    //   foreignKey: {
    //     name: 'lotteryId',
    //     allowNull: true
    //   },
    //   as: 'sockets'
    // });
  };

  return Good;
};