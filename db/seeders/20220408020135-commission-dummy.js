'use strict';

const faker = require('@faker-js/faker').faker

const status = ['OPEN', 'CLOSED']

const commissionDummy = [...Array(20)].map((commission) => {
  return {
    title: faker.lorem.sentence(4),
    duration_time: Math.floor(Math.random() * 7) + 1,
    price: Number(faker.commerce.price(30000, 500000, 0)),
    description: faker.lorem.text(),
    status: status[Math.floor(Math.random() * 2)],
    image_1: faker.image.abstract(),
    image_2: (Math.random() > 0.5 ? faker.image.abstract() : null),
    image_3: (Math.random() > 0.5 ? faker.image.abstract() : null),
    image_4: (Math.random() > 0.5 ? faker.image.abstract() : null),
    created_at: new Date(),
    updated_at: new Date(),
    illustrator_id: Math.floor(Math.random() * 20) + 1,
    category_id: Math.floor(Math.random() * 7) + 1
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
   await queryInterface.bulkInsert('commission_posts', commissionDummy)
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
     await queryInterface.sequelize.query('SET FOREIGN_KEY_CHECKS = 0')
     await queryInterface.bulkDelete('commission_posts', null, {truncate: true})
     await queryInterface.sequelize.query('SET FOREIGN_KEY_CHECKS = 1')
  }
};
