'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('ass_asset', 'ass_nft_serial', {
      type: Sequelize.STRING(255),
      allowNull: true,
      defaultValue: null,
      after: 'ass_collection_id',
    });

    await queryInterface.addColumn('ass_asset', 'ass_topic_id', {
      type: Sequelize.STRING(255),
      allowNull: true,
      defaultValue: null,
      after: 'ass_manufacture_year',
    });

    await queryInterface.addColumn('ass_asset', 'ass_topic_token_gate_id', {
      type: Sequelize.STRING(255),
      allowNull: true,
      defaultValue: null,
      after: 'ass_topic_id',
    });
  },

  async down(queryInterface) {
    await queryInterface.removeColumn('ass_asset', 'ass_collection_id');
    await queryInterface.removeColumn('ass_asset', 'ass_topic_id');
    await queryInterface.removeColumn('ass_asset', 'ass_topic_token_gate_id');
  },
};
