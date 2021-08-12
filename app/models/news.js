'use strict';
module.exports = function (sequelize, DataTypes) {
  const News = sequelize.define('News', {
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
    // 1 for competition 
    type: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 1
    }
  }, {
    paranoid: true
  });

  News.associate = (models) => {
    News.belongsTo(models.Competition, {
      foreignKey: {
        name: 'competitionId',
        allowNull: true
      },
      as: 'competitions'
    });
  };

  return News;
};