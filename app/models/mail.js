'use strict';
module.exports = function (sequelize, DataTypes) {
  const Mail = sequelize.define('Mail', {
    subject: {
      type: DataTypes.STRING,
      allowNull: false
    },
    text: {
      type: DataTypes.STRING,
      allowNull: false
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false
    },
    userId: {
      type: DataTypes.STRING,
      allowNull: false
    },
    runDate: {
      type: DataTypes.DATE,
      allowNull: false
    },
    runTime: {
      type: DataTypes.TIME,
      allowNull: false
    },
    sended: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      default: false
    },
  }, {
    paranoid: true
  });

  Mail.associate = (models) => {
  };

  return Mail;
};