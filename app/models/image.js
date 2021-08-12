'use strict';
module.exports = function (sequelize, DataTypes) {
  const Image = sequelize.define('Image', {
    image: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    // 1 for good
    type: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1
    },
    userId: {
      type: DataTypes.STRING,
      allowNull: false
    },
    isMain: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    }
  }, {
    paranoid: true
  });

  Image.associate = (models) => {
    Image.belongsTo(models.Good, {
      foreignKey: {
        name: 'goodId',
        allowNull: true
      },
      as: 'goods'
    });
  };

  return Image;
};