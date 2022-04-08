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

    await queryInterface.bulkInsert('categories', [
      {category_name: 'Pixel art'},
      {category_name: 'Cartoon & comic'},
      {category_name: 'Vector'},
      {category_name: 'Sketch'},
      {category_name: 'Logo'},
      {category_name: 'Anime & manga'},
      {category_name: 'Doodle'},
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
    await queryInterface.bulkDelete('categories', null, {truncate: true})
    await queryInterface.sequelize.query('SET FOREIGN_KEY_CHECKS = 1')
  }
};
