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
   await queryInterface.bulkInsert('tags', [
     {tag_name: 'Chibi'},
     {tag_name: 'Full body'},
     {tag_name: 'Half body'},
     {tag_name: 'Background'},
     {tag_name: 'Game'},
     {tag_name: 'Character'},
     {tag_name: 'Scenery'},
     {tag_name: 'Animal'},
     {tag_name: 'Vehicle'},
     {tag_name: 'Building'},
   ])
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
     await queryInterface.sequelize.query('SET FOREIGN_KEY_CHECKS = 0')
     await queryInterface.bulkDelete('tags', null, {truncate: true})
     await queryInterface.sequelize.query('SET FOREIGN_KEY_CHECKS = 1')
  }
};
