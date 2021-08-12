'use strict';
module.exports = function (sequelize, DataTypes) {
  const Group = sequelize.define('Group', {
    title: {
      type: DataTypes.STRING,
      allowNull: false
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false
    },
    competitor: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    // this field use for type 3 for group duel
    // 1 for win
    // 2 for equel
    // 3 for lost
    win: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    owner: {
      type: DataTypes.STRING,
      allowNull: true
    },
  }, {
    paranoid: true
  });

  Group.associate = (models) => {
    Group.belongsTo(models.Competition, {
      foreignKey: {
        name: 'competitionId',
        allowNull: true
      },
      as: 'competitions'
    });
  };

  return Group;
};