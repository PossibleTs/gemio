'use strict';
const bcrypt = require('bcrypt');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    const salt = await bcrypt.genSalt();
    const passwordHash = await bcrypt.hash('Gemio@123', salt);

    await queryInterface.bulkInsert('usr_user', [
      {
        usr_name: 'Admin',
        usr_email: 'admin@admin.com',
        usr_password: passwordHash,
        usr_permission: 'admin',
      },
    ]);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('usr_user', {
      usr_email: 'admin@admin.com',
    });
  },
};
