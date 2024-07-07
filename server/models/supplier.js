'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Supplier extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Supplier.init({
    supplier_name: DataTypes.STRING,
    supplier_address: DataTypes.STRING,
    supplier_email: DataTypes.STRING,
    supplier_contact: DataTypes.STRING,
    supplier_fax: DataTypes.STRING,
    supplier_website: DataTypes.STRING,
    supplier_NPWP: DataTypes.STRING,
    supplier_debt: DataTypes.FLOAT,
    supplier_time: DataTypes.STRING,
    status: DataTypes.BOOLEAN,
    createdBy: DataTypes.STRING,
    updatedBy: DataTypes.STRING,
  }, {
    sequelize,
    modelName: 'Supplier',
  });
  return Supplier;
};