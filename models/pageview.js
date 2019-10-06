'use strict';
module.exports = (sequelize, DataTypes) => {
  const PageView = sequelize.define('PageView', {
    viewCount: DataTypes.INTEGER,
    userId: DataTypes.INTEGER,
    productId: DataTypes.INTEGER
  }, {});
  PageView.associate = function (models) {
    // associations can be defined here
    PageView.belongsTo(models.User)
    PageView.belongsTo(models.Product)
  };
  return PageView;
};