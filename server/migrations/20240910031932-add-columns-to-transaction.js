'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.addColumn('Transactions', 'transaction_invoice_number', {
      type: Sequelize.STRING, // or another data type (INTEGER, BOOLEAN, etc.)
      allowNull: true, // or false, depending on your requirements
      defaultValue: null, // or another default value if needed
    }).then(() => {
      return queryInterface.addColumn('Transactions', 'transaction_payment_due_time', {
        type: Sequelize.INTEGER, // Change to the desired data type
        allowNull: false, // or true, depending on your requirements
        defaultValue: 0, // or another default value if needed
      });
    }).then(() => {
      return queryInterface.addColumn('Transactions', 'transaction_proof_number', {
        type: Sequelize.STRING, // Change to the desired data type
        allowNull: true, // or true, depending on your requirements
        defaultValue: null, // or another default value if needed
      });
    }).then(() => {
      return queryInterface.addColumn('Transactions', 'PPN', {
        type: Sequelize.BOOLEAN, // Change to the desired data type
      });
    })
  },

  async down(queryInterface, Sequelize) {

    return queryInterface.removeColumn('Transactions', 'transaction_invoice_number')
      .then(() => {
        return queryInterface.removeColumn('Transactions', 'transaction_payment_due_time');
      })
      .then(() => {
        return queryInterface.removeColumn('Transactions', 'transaction_proof_number');
      }).then(() => {
        return queryInterface.removeColumn('Transactions', 'PPN');
      });

  }
};
