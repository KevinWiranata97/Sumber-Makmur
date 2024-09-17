'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Tax_Information extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // Association with CompanyProfile
      Tax_Information.belongsTo(models.Company_Profile, { foreignKey: 'company_id', onDelete: 'CASCADE' });
    }
  }
  Tax_Information.init({
    tax_number: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    default_rack: {
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
    modelName: 'Tax_Information',
    tableName: 'tax_information',
    timestamps: true, // automatically manages createdAt and updatedAt
  });
  return Tax_Information;
};
