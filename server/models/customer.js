'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Customer extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Customer.belongsTo(models.Area, { foreignKey: 'customer_area_id'});
      Customer.belongsTo(models.Expedition, { foreignKey: 'customer_expedition_id'});
    }
  }
  Customer.init({
    customer_name: DataTypes.STRING,
    customer_address_1: DataTypes.STRING,
    customer_address_2: DataTypes.STRING,
    customer_expedition_id: DataTypes.INTEGER,
    customer_area_id: DataTypes.INTEGER,
    customer_phone: DataTypes.STRING,
    customer_email: DataTypes.STRING,
    customer_contact: DataTypes.STRING,
    customer_plafon: DataTypes.FLOAT,
    customer_NPWP: DataTypes.STRING,
    customer_grade_id: DataTypes.INTEGER,
    customer_time: DataTypes.INTEGER,
    customer_discount: DataTypes.INTEGER,
    status:DataTypes.BOOLEAN,
    updatedBy: DataTypes.STRING,
    createdBy: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Customer',
  });
  return Customer;
};