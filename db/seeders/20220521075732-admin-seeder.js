'use strict';
const bcrypt = require('bcrypt')
const { hash } = require('../../config/config')

module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */
    const salt = await bcrypt.genSalt(hash.saltRounds)
    const hashedPassword = await bcrypt.hash(process.env.SUPER_ADMIN_PASSWORD, salt) 
    await queryInterface.bulkInsert('administrators', [{
      username: process.env.SUPER_ADMIN_USERNAME,
      name: process.env.SUPER_ADMIN_NAME,
      password: hashedPassword,
      created_at: new Date(),
      updated_at: new Date()
    }])
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    await queryInterface.bulkDelete('administrators', { username: process.env.SUPER_ADMIN_USERNAME })
  }
};
