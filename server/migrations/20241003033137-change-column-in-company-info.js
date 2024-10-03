'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.renameColumn('tax_information', 'default_rack', 'tax_ppn');
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.renameColumn('tax_information', 'tax_ppn', 'default_rack');
  }
};
