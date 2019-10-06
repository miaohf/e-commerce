'use strict';
module.exports = (sequelize, DataTypes) => {
  const Product = sequelize.define('Product', {
    name: DataTypes.STRING,
    discription: DataTypes.TEXT,
    image: DataTypes.STRING,
    price: DataTypes.FLOAT,
    recommendedPrice: DataTypes.FLOAT,
    inventory: DataTypes.INTEGER
  }, {});
  Product.associate = function (models) {
    // associations can be defined here
    Product.belongsTo(models.Category)
    Product.hasMany(models.Review)
    Product.hasMany(models.Like)
    Product.hasMany(models.PageView)
    Product.hasMany(models.CartItem)
    Product.hasMany(models.OrderItem)

    Product.belongsToMany(models.Cart, {
      as: 'carts',
      through: {
        model: models.CartItem, unique: false
      },
      foreignKey: 'productId'
    });
    Product.belongsToMany(models.Order, {
      as: 'orders',
      through: {
        model: models.OrderItem, unique: false
      },
      foreignKey: 'productId'
    });
    Product.belongsToMany(models.User, {
      as: 'userViews',
      through: {
        model: models.User, unique: false
      },
      foreignKey: 'productId'
    });
    Product.belongsToMany(models.User, {
      as: 'userLikes',
      through: {
        model: models.Like, unique: false
      },
      foreignKey: 'productId'
    });

  };
  return Product;
};