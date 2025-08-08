'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('com_company', 'com_hedera_history_id', {
      type: Sequelize.STRING(255),
      allowNull: true,
      after: 'com_is_active',
    });
  },

  async down(queryInterface) {
    await queryInterface.removeColumn('com_company', 'com_hedera_history_id');
  },
};
