'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('ass_asset', 'ass_metadata_cid', {
      type: Sequelize.STRING(255),
      allowNull: true,
      defaultValue: null,
      after: 'ass_topic_token_gate_id',
    });
  },

  async down(queryInterface) {
    await queryInterface.removeColumn('ass_asset', 'ass_metadata_cid');
  },
};
