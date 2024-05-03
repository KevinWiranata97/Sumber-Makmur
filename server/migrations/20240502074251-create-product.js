'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Products', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      name: {
        type: Sequelize.STRING
      },
      part_number: {
        type: Sequelize.STRING
      },
      product: {
        type: Sequelize.STRING
      },
      type: {
        type: Sequelize.STRING
      },
      replacement_code: {
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
      supplier_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Suppliers',
          key: 'id'
        },
        onUpdate: 'cascade',
        onDelete: 'cascade'
      },
      NPWP: {
        type: Sequelize.STRING,
        
      },
      stock: {
        type: Sequelize.INTEGER
      },
      unit_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Units',
          key: 'id'
        },
        onUpdate: 'cascade',
        onDelete: 'cascade'
      },
      cost: {
        type: Sequelize.FLOAT
      },
      sell_price: {
        type: Sequelize.FLOAT
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
    await queryInterface.dropTable('Products');
  }
};