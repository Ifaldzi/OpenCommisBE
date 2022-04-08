'use strict';

const faker = require('@faker-js/faker').faker

const illustratorDummy = [...Array(20)].map((illustrator) => {
  return {
    name: faker.name.findName(),
    email: faker.internet.email(),
    username: faker.internet.userName(),
    password: faker.internet.password(),
    phone: faker.phone.phoneNumber('08##########'),
    profile_picture: faker.image.avatar(),
    available: Math.random() < 0.5,
    created_at: new Date(),
    updated_at: new Date()
  }
})

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

    await queryInterface.bulkInsert('illustrators', illustratorDummy)
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */

     await queryInterface.sequelize.query('SET FOREIGN_KEY_CHECKS = 0')
     await queryInterface.bulkDelete('illustrators', null, {truncate: true})
     await queryInterface.sequelize.query('SET FOREIGN_KEY_CHECKS = 1')
  }
};
