'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.addColumn('Transaction_Products', 'status', {
      type: Sequelize.BOOLEAN, // or another data type (INTEGER, BOOLEAN, etc.)

      defaultValue: true, // or another default value if needed
    }).then(() => {
      return queryInterface.addColumn('Transaction_Products', 'current_cost', {
        type: Sequelize.INTEGER, // Change to the desired data type
      });
    })
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.removeColumn('Transaction_Products', 'status').then(() => {
      return queryInterface.removeColumn('Transaction_Products', 'current_cost');
    })
  }
};
