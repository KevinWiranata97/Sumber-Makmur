'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
     queryInterface.addColumn('Suppliers', 'supplier_time', { type: Sequelize.STRING });
     queryInterface.addColumn('Suppliers', 'supplier_debt', { type: Sequelize.FLOAT });
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
     queryInterface.removeColumn('Suppliers', 'name');
     queryInterface.removeColumn('Suppliers', 'supplier_debt');
  }
};
