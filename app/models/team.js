'use strict';
module.exports = function (sequelize, DataTypes) {
  const Team = sequelize.define('Team', {
    userId: {
      type: DataTypes.STRING,
      allowNull: false
    },
    name: {
      type: DataTypes.STRING,
      allowNull: true
    }
  }, {
    paranoid: true
  });

  Team.associate = (models) => {
    // Prize.belongsTo(models.Lottery, {
    //   foreignKey: {
    //     name: 'lotteryId',
    //     allowNull: true
    //   },
    //   as: 'prizes'
    // });
  };

  return Team;
};