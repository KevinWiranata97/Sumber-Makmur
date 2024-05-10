'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Transaction extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // Define association with Transaction_Product model
      Transaction.hasMany(models.Transaction_Product, { foreignKey: 'transaction_id' });
    }
  }
  Transaction.init({
    transaction_date: DataTypes.DATE,
    transaction_due_date: DataTypes.DATE,
    transaction_PO_num: DataTypes.STRING,
    transaction_surat_jalan: DataTypes.STRING,
    transaction_customer_id: DataTypes.INTEGER,
    transaction_supplier_id:DataTypes.INTEGER,
    transaction_note: DataTypes.STRING,
    transaction_PO_note: DataTypes.STRING,
    transaction_type:DataTypes.STRING,
    status:DataTypes.BOOLEAN,
    createdBy: DataTypes.STRING,
    updatedBy: DataTypes.STRING,
  }, {
    sequelize,
    modelName: 'Transaction',
  });
  return Transaction;
};
