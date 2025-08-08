'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('col_collection', {
      col_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        unique: true,
        primaryKey: true,
      },
      col_hedera_token_id: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
      col_name: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
      col_symbol: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
      col_status: {
        type: Sequelize.ENUM(['active']),
        allowNull: false,
        defaultValue: 'active',
      },
      col_created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      col_updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('col_collection');
  },
};
