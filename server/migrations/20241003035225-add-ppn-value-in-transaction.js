'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.addColumn('Transactions', 'transaction_ppn_value', {
      type: Sequelize.INTEGER, // or another data type (INTEGER, BOOLEAN, etc.)
      allowNull: true, // or false, depending on your requirements
      defaultValue: null, // or another default value if needed
    }).then(() => {
      return queryInterface.addColumn('Transactions', 'transaction_discount', {
        type: Sequelize.INTEGER, // Change to the desired data type
      });
    })
  },

  async down(queryInterface, Sequelize) {

    return queryInterface.removeColumn('Transactions', 'transaction_ppn_value').then(() => {
      return queryInterface.removeColumn('Transactions', 'transaction_discount');
    })
  }
};
