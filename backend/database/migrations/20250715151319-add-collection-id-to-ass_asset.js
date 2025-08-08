'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('ass_asset', 'ass_collection_id', {
      type: Sequelize.STRING(255),
      allowNull: false,
      after: 'ass_name',
    });
  },

  async down(queryInterface) {
    await queryInterface.removeColumn('ass_asset', 'ass_collection_id');
  },
};
