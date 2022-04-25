'use strict';

const faker = require('@faker-js/faker').faker

const reviews = []

for (let i = 1; i <= 20; i++) {
  const totalReviews = Math.floor(Math.random() * 7) + 1
  for (let j = 0; j < totalReviews; j++) {
    reviews.push({
      commission_post_id: i,
      rating: Math.floor(Math.random() * 6),
      comment: Math.random() > .5 ? null : faker.lorem.sentence(),
      created_at: faker.date.past(),
      consumer_id: Math.floor(Math.random() * 20) + 1
    })
  }
  
}

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
   await queryInterface.bulkInsert('reviews', reviews)
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    await queryInterface.sequelize.query('SET FOREIGN_KEY_CHECKS = 0')
    for (let i=1; i<=20; i++) {
      await queryInterface.bulkDelete('reviews', { commission_post_id: i })
    }
    await queryInterface.sequelize.query('SET FOREIGN_KEY_CHECKS = 1')
  }
};
