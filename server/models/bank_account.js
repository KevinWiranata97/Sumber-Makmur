'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Bank_Account extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // Association with CompanyProfile
      Bank_Account.belongsTo(models.Company_Profile, { foreignKey: 'company_id', onDelete: 'CASCADE' });
    }
  }
  Bank_Account.init({
    account_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    account_number: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    bank_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    bank_branch: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    status: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'Bank_Account',
    tableName: 'bank_accounts',
    timestamps: true, // automatically manages createdAt and updatedAt
  });
  return Bank_Account;
};
