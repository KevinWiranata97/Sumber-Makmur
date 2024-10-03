'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('Transactions', 'transaction_total_amount', {
      type: Sequelize.FLOAT,
    });


    await queryInterface.addColumn('Transactions', 'transaction_total_netto', {
      type: Sequelize.FLOAT,
    });  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('Transactions', 'transaction_total_amount');
    await queryInterface.removeColumn('Transactions', 'transaction_total_netto');
  },
};