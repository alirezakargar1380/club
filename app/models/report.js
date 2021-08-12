'use strict';
module.exports = function (sequelize, DataTypes) {
  const Report = sequelize.define('Report', {
    // 1 for comment
    // 2 for question
    type: {
      type: DataTypes.STRING,
      allowNull: false
    },
    // this code for use by user  and  deposit coin and diamond for ad user
    comment: {
      type: DataTypes.STRING,
      allowNull: false
    },

    userId: {
      type: DataTypes.STRING,
      allowNull: false
    },
    updatedBy: {
      type: DataTypes.STRING,
      allowNull: true
    }
  }, {
    paranoid: true
  });

  Report.associate = (models) => {
    Report.belongsTo(models.Comment, {
      foreignKey: {
        name: 'commentId',
        allowNull: true
      },
      as: 'comments'
    });

    Report.belongsTo(models.Question, {
      foreignKey: {
        name: 'questionId',
        allowNull: true
      },
      as: 'questions'
    });
  };

  return Report;
};