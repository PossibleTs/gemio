'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('ass_asset', {
      ass_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        unique: true,
        primaryKey: true,
      },
      ass_com_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'com_company',
          key: 'com_id',
        },
        onDelete: 'NO ACTION',
        onUpdate: 'NO ACTION',
      },
      ass_name: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
      ass_machine_type: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
      ass_serial_number: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
      ass_manufacturer: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
      ass_model: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
      ass_manufacture_year: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      ass_status: {
        type: Sequelize.ENUM(['pending', 'accepted', 'declined']),
        allowNull: false,
      },
      ass_created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      ass_updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('ass_asset');
  },
};
