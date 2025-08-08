'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('ame_asset_message', 'ame_transaction_id', {
      type: Sequelize.STRING(255),
      allowNull: true,
      defaultValue: null,
      after: 'ame_message',
    });
  },

  async down(queryInterface) {
    await queryInterface.removeColumn(
      'ame_asset_message',
      'ame_transaction_id',
    );
  },
};
