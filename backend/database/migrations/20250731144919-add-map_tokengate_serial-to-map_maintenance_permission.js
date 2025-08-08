'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn(
      'map_maintenance_permission',
      'map_tokengate_serial',
      {
        type: Sequelize.INTEGER,
        allowNull: true,
        after: 'map_ass_id',
      },
    );
  },

  async down(queryInterface) {
    await queryInterface.removeColumn(
      'map_maintenance_permission',
      'map_tokengate_serial',
    );
  },
};
