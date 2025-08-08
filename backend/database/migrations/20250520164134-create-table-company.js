'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('com_company', {
      com_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        unique: true,
        primaryKey: true,
      },
      com_name: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
      com_cnpj: {
        type: Sequelize.STRING(14),
        allowNull: false,
      },
      com_type: {
        type: Sequelize.ENUM(['creator', 'owner', 'maintainer']),
        allowNull: false,
      },
      com_create_wallet: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
      },
      com_hedera_account_id: {
        type: Sequelize.STRING(30),
        allowNull: false,
      },
      com_hedera_mnemonic_phrase: {
        type: Sequelize.STRING(300),
        allowNull: false,
      },
      com_hedera_private_key: {
        type: Sequelize.STRING(300),
        allowNull: false,
      },
      com_approval_status: {
        type: Sequelize.ENUM(['pending', 'approved']),
        allowNull: false,
        defaultValue: 'pending',
      },
      com_is_active: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
      com_created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      com_updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('com_company');
  },
};
