'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('usr_user', {
      usr_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        unique: true,
        primaryKey: true,
      },
      usr_com_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'com_company',
          key: 'com_id',
        },
        onDelete: 'NO ACTION',
        onUpdate: 'NO ACTION',
      },
      usr_name: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
      usr_email: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
      usr_password: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
      usr_permission: {
        type: Sequelize.ENUM(['admin', 'company']),
        allowNull: false,
      },
      usr_is_active: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
      usr_created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      usr_updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('usr_user');
  },
};
