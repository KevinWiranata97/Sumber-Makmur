'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('Transaction_Products', 'note', {
      type: Sequelize.STRING,
    });


    await queryInterface.addColumn('Transaction_Products', 'po_note', {
      type: Sequelize.STRING,
    });  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('Transaction_Products', 'note');
    await queryInterface.removeColumn('Transaction_Products', 'po_note');
  },
};