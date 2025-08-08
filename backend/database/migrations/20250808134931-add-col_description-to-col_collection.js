'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('col_collection', 'col_description', {
      type: Sequelize.STRING(2000),
      allowNull: true,
      defaultValue: null,
      after: 'col_symbol',
    });
  },

  async down(queryInterface) {
    await queryInterface.removeColumn('col_collection', 'col_description');
  },
};
