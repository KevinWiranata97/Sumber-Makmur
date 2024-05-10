'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Customers', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      customer_name: {
        type: Sequelize.STRING
      },
      customer_address_1: {
        type: Sequelize.STRING
      },
      customer_address_2: {
        type: Sequelize.STRING
      },
      customer_expedition_id: {
        type: Sequelize.INTEGER
      },
      customer_area_id: {
        type: Sequelize.INTEGER
      },
      customer_phone: {
        type: Sequelize.STRING
      },
      customer_email: {
        type: Sequelize.STRING
      },
      customer_contact: {
        type: Sequelize.STRING
      },
      customer_plafon: {
        type: Sequelize.FLOAT
      },
      customer_NPWP: {
        type: Sequelize.STRING
      },
      customer_grade_id: {
        type: Sequelize.INTEGER
      },
      customer_time: {
        type: Sequelize.INTEGER
      },
      customer_discount: {
        type: Sequelize.INTEGER
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
    await queryInterface.dropTable('Customers');
  }
};