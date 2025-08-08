'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('usr_user', 'usr_hedera_history_id', {
      type: Sequelize.STRING(255),
      allowNull: true,
      after: 'usr_is_active',
    });
  },

  async down(queryInterface) {
    await queryInterface.removeColumn('usr_user', 'usr_hedera_history_id');
  },
};
