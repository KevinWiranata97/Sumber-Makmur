'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Company_Profile extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            Company_Profile.hasMany(models.Bank_Account, { foreignKey: 'company_id', as: 'bank_accounts' });
            Company_Profile.hasOne(models.Tax_Information, { foreignKey: 'company_id', as: 'tax_information' });
        }
    }
    Company_Profile.init({
        company_name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        address: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        phone: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        fax: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        city: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        postal_code: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        country: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        email: {
            type: DataTypes.STRING,
            allowNull: true,
            validate: {
                isEmail: true,
            },
        },
        website: {
            type: DataTypes.STRING,
            allowNull: true,
            
        },
        npwp: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        person_1: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        person_2: {
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
        modelName: 'Company_Profile',
        tableName: 'company_profile', // Explicitly specifying the table name
        timestamps: true, // Manages `createdAt` and `updatedAt`
    });
    return Company_Profile;
};
