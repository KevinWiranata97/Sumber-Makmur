'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Suppliers', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      supplier_name: {
        type: Sequelize.STRING
      },
      supplier_address: {
        type: Sequelize.STRING
      },
      supplier_email: {
        type: Sequelize.STRING
      },
      supplier_contact: {
        type: Sequelize.STRING
      },
      supplier_fax: {
        type: Sequelize.STRING
      },
      supplier_website: {
        type: Sequelize.STRING
      },
      supplier_NPWP: {
        type: Sequelize.STRING
      },
      status: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue:true
      },
      createdBy: {
        type: Sequelize.STRING
      },
      updatedBy: {
        type: Sequelize.STRING
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
  
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Suppliers');
  }
};