'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Transaction_Product extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Transaction_Product.belongsTo(models.Product, { foreignKey: 'product_id'});
    }
  }
  Transaction_Product.init({
    transaction_id: DataTypes.INTEGER,
    product_id: DataTypes.INTEGER,
    qty: DataTypes.INTEGER,
    status: DataTypes.BOOLEAN,
    current_cost:DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Transaction_Product',
  });
  return Transaction_Product;
};