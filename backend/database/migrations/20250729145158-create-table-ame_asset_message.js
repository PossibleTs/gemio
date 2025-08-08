'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('ame_asset_message', {
      ame_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        unique: true,
        primaryKey: true,
      },
      ame_ass_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'ass_asset',
          key: 'ass_id',
        },
        onDelete: 'NO ACTION',
        onUpdate: 'NO ACTION',
      },
      ame_created_by_com_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'com_company',
          key: 'com_id',
        },
        onDelete: 'NO ACTION',
        onUpdate: 'NO ACTION',
      },
      ame_message: {
        type: Sequelize.STRING(2000),
        allowNull: false,
        defaultValue: '',
      },
      ame_created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      ame_updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('ame_asset_message');
  },
};
