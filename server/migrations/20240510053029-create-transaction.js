'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Transactions', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      transaction_date: {
        type: Sequelize.DATE
      },
      transaction_due_date: {
        type: Sequelize.DATE
      },
      transaction_PO_num: {
        type: Sequelize.STRING
      },
      transaction_surat_jalan: {
        type: Sequelize.STRING
      },
      transaction_customer_id: {
      
        type: Sequelize.INTEGER,
        references: {
          model: 'Customers',
          key: 'id'
        },
        onUpdate: 'cascade',
        onDelete: 'cascade'
      },
      transaction_supplier_id: {
      
        type: Sequelize.INTEGER,
        references: {
          model: 'Suppliers',
          key: 'id'
        },
        onUpdate: 'cascade',
        onDelete: 'cascade'
      },

      transaction_note: {
        type: Sequelize.STRING
      },
      transaction_PO_note: {
        type: Sequelize.STRING
      },
      transaction_type: {
        type: Sequelize.STRING
      },
      
      status: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedBy: {
        type: Sequelize.STRING,
      },
      createdBy: {
        type: Sequelize.STRING,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Transactions');
  }
};