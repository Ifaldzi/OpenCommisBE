'use strict';

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
   const dummyData = []
   let tagCount = 1
   for (let i = 0; i < 20; i++) {
     tagCount = Math.floor(Math.random() * 5) + 1
     for (let j = 0; j < tagCount; j++) {
       dummyData.push({
         commission_post_id: i + 1,
         tag_id: j + 1
       })
     }
   }

   await queryInterface.bulkInsert('commission_tags', dummyData)
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
     await queryInterface.sequelize.query('SET FOREIGN_KEY_CHECKS = 0')
     await queryInterface.bulkDelete('commission_tags', null, {truncate: true})
     await queryInterface.sequelize.query('SET FOREIGN_KEY_CHECKS = 1')
  }
};
