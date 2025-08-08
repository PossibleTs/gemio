'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.removeColumn('ass_asset', 'ass_collection_id');

    await queryInterface.addColumn('ass_asset', 'ass_col_id', {
      type: Sequelize.INTEGER,
      allowNull: false,
      after: 'ass_id',
      references: {
        model: 'col_collection',
        key: 'col_id',
      },
      onDelete: 'NO ACTION',
      onUpdate: 'NO ACTION',
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('ass_asset', 'ass_col_id');

    await queryInterface.addColumn('ass_asset', 'ass_collection_id', {
      type: Sequelize.STRING(255),
      allowNull: false,
      after: 'ass_name',
    });
  },
};
