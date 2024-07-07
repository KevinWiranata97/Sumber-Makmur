'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Expeditions', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      expedition_name: {
        type: Sequelize.STRING
      },
      expedition_address: {
        type: Sequelize.STRING
      },
      expedition_contact: {
        type: Sequelize.STRING
      },
      expedition_phone: {
        type: Sequelize.STRING
      },
      expedition_fax: {
        type: Sequelize.STRING
      },
      expedition_destination: {
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
    await queryInterface.dropTable('create-expeditions');
  }
};