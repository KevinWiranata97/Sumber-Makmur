"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addConstraint("Customers", {
      fields: ["customer_area_id"], // Name of the existing column
      type: "foreign key",
      name: "fk_area_id", // Name of the foreign key constraint
      references: {
        table: "Areas", // Name of the target table
        field: "id", // Key in the target table that the foreign key will reference
      },
      onUpdate: "CASCADE",
      onDelete: "SET NULL",
    });

    await queryInterface.addConstraint("Customers", {
      fields: ["customer_expedition_id"], // Name of the existing column
      type: "foreign key",
      name: "fk_expedition_id", // Name of the foreign key constraint
      references: {
        table: "Expeditions", // Name of the target table
        field: "id", // Key in the target table that the foreign key will reference
      },
      onUpdate: "CASCADE",
      onDelete: "SET NULL",
    });

  },

  async down(queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    await queryInterface.removeConstraint("Customers", "fk_area_id");
    await queryInterface.removeConstraint("Customers", "fk_expedition_id");
  },
};
