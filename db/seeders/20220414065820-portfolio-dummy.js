'use strict';

const faker = require('@faker-js/faker').faker

const portfolioDummy = [...Array(20)].map((data, index) => {
  return {
    bio: faker.lorem.paragraph(4),
    instagram_acc: Math.random() > 0.5 ? '@' + faker.internet.userName() : null,
    twitter_acc: Math.random() > 0.5 ? '@' + faker.internet.userName() : null,
    facebook_acc: Math.random() > 0.5 ? '@' + faker.internet.userName() : null,
    illustrator_id: index + 1
  }
})

const artworkDummy = []

for (let i=0; i<20; i++) {
  const artworkCount = Math.floor(Math.random() * 5) + 1

  for (let j=0; j<artworkCount; j++) {
    artworkDummy.push({
      image: faker.image.abstract(),
      description: faker.lorem.sentence(),
      created_at: new Date(),
      updated_at: new Date(),
      illustrator_id: i + 1
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
   await queryInterface.bulkInsert('portfolios', portfolioDummy)
   await queryInterface.bulkInsert('artworks', artworkDummy)
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
     await queryInterface.sequelize.query('SET FOREIGN_KEY_CHECKS = 0')
     await queryInterface.bulkDelete('portfolios', null, {truncate: true})
     await queryInterface.sequelize.query('SET FOREIGN_KEY_CHECKS = 1')

     await queryInterface.sequelize.query('SET FOREIGN_KEY_CHECKS = 0')
     await queryInterface.bulkDelete('artworks', null, {truncate: true})
     await queryInterface.sequelize.query('SET FOREIGN_KEY_CHECKS = 1')
  }
};
