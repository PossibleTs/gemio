'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('map_maintenance_permission', {
      map_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        unique: true,
        primaryKey: true,
      },
      map_com_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'com_company',
          key: 'com_id',
        },
        onDelete: 'NO ACTION',
        onUpdate: 'NO ACTION',
      },
      map_ass_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'ass_asset',
          key: 'ass_id',
        },
        onDelete: 'NO ACTION',
        onUpdate: 'NO ACTION',
      },
      map_start_date: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      map_end_date: {
        type: Sequelize.DATE,
        allowNull: true,
        defaultValue: null,
      },
      map_created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      map_updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('map_maintenance_permission');
  },
};
