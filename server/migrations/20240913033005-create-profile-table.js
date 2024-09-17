'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    // Create the company_profile table
    await queryInterface.createTable('company_profile', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      company_name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      address: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      phone: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      fax: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      city: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      postal_code: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      country: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      email: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      website: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      npwp: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      person_1: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      person_2: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
      status: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue:true
      }
    });

    // Create the bank_accounts table
    await queryInterface.createTable('bank_accounts', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      company_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'company_profile',
          key: 'id',
        },
        onDelete: 'CASCADE',
        allowNull: false,
      },
      account_name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      account_number: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      bank_name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      bank_branch: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
      status: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue:true
      }
    });

    // Create the tax_information table
    await queryInterface.createTable('tax_information', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      company_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'company_profile',
          key: 'id',
        },
        onDelete: 'CASCADE',
        allowNull: false,
      },
      tax_number: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      default_rack: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
      status: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue:false
      }
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('tax_information');
    await queryInterface.dropTable('bank_accounts');
    await queryInterface.dropTable('company_profile');
  }
};
