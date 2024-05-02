'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Product extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Product.init({
    name: DataTypes.STRING,
    part_number: DataTypes.STRING,
    product: DataTypes.STRING,
    type: DataTypes.STRING,
    replacement_code: DataTypes.STRING,
    storage_id: DataTypes.STRING,
    NPWP: DataTypes.STRING,
    stock: DataTypes.INTEGER,
    unit_id: DataTypes.STRING,
    cost: DataTypes.FLOAT,
    sell_price: DataTypes.FLOAT,
    createdBy: DataTypes.STRING,
    updatedBy: DataTypes.STRING,
    updated_at: DataTypes.DATE,
    created_at: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'Product',
  });
  return Product;
};