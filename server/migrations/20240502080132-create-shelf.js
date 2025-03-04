'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('shelves', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      shelf_name: {
        type: Sequelize.STRING
      },
      shelf_code: {
        type: Sequelize.STRING
      },
      storage_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Storages',
          key: 'id'
        },
        onUpdate: 'cascade',
        onDelete: 'cascade'
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
    await queryInterface.dropTable('shelves');
  }
};