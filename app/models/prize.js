'use strict';
module.exports = function (sequelize, DataTypes) {
  const Prize = sequelize.define('Prize', {
    title: {
      type: DataTypes.STRING,
      allowNull: false
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false
    },
    image: {
      type: DataTypes.STRING,
      allowNull: false
    },
    multiOwnerPrize: {
      type: DataTypes.BOOLEAN,
      allowNull: true
    },
    userId: {
      type: DataTypes.STRING,
      allowNull: false
    },
    order: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    // in lottery is for number day 
    // in roulette is for count execute
    executeNumber: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue :  0
    },
    percentChance: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    // 1 for lottery
    // 2 for roulette
    // 3 for competition
    category: {
      type: DataTypes.INTEGER,
      defaultValue: 1
    },
    // 0 for default
    // 2 for execute lottery
    // 3 for delete from lottery because not exist good when lottery execute
    statusPay: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    expireDay: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    confirmedBy: {
      type: DataTypes.STRING,
      allowNull: true
    },
    runDate: {
      type: DataTypes.DATE,
      allowNull: true
    },
    runTime: {
      type: DataTypes.TIME,
      allowNull: true
    },
    sequential: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
  }, {
    paranoid: true
  });

  Prize.associate = (models) => {
    Prize.belongsTo(models.Lottery, {
      foreignKey: {
        name: 'lotteryId',
        allowNull: true
      },
      as: 'lotteries'
    });

    Prize.belongsTo(models.Roulette, {
      foreignKey: {
        name: 'rouletteId',
        allowNull: true
      },
      as: 'roulettePrizes'
    });


    Prize.belongsTo(models.FieldWork, {
      foreignKey: {
        name: 'fieldWorkId',
        allowNull: true
      },
      as: 'fieldWorks'
    });


    Prize.belongsTo(models.Competition, {
      foreignKey: {
        name: 'competitionId',
        allowNull: true
      },
      as: 'Competitions'
    });
    Prize.belongsTo(models.Group, {
      foreignKey: {
        name: 'groupId',
        allowNull: true
      },
      as: 'Groups'
    });

  };

  return Prize;
};