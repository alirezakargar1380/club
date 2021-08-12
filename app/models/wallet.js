'use strict';
module.exports = function(sequelize, DataTypes) {
  const Wallet = sequelize.define('Wallet', {
    userId: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    diamond: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    coin: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    step1ConfirmedBy: {
      type: DataTypes.STRING,
      allowNull: true
    },
    step2ConfirmedBy: {
      type: DataTypes.STRING,
      allowNull: true
    },
    step3ConfirmedBy: {
      type: DataTypes.STRING,
      allowNull: true
    },
  }, { 
    paranoid: true
  });

  Wallet.associate = (models) => {
    // Wallet.belongsTo(models.Group, {
    //   foreignKey: {
    //     name: 'groupId',
    //     allowNull: true
    //   },
    //   as: 'groups'
    // });
  };

  return Wallet;
};
