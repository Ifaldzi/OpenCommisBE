'use strict';

const faker = require('@faker-js/faker').faker

const status = ['CREATED', 'ACCEPTED', 'DENIED', 'NOT_PAID', 'ON_WORK', 'FAILED', 'SENT', 'FINISHED']

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

  const orderDummy = []
  for (let i=0; i<20; i++) {
    const commissionId = Math.floor(Math.random() * 20) + 1
    const commissionPrice = await queryInterface.rawSelect('commission_posts', { where: {id: commissionId} }, 'price')

    orderDummy[i] = {
      commission_post_id: commissionId,
      consumer_id: Math.floor(Math.random() * 20) + 1,
      order_date: faker.date.recent(14),
      status: status[Math.floor(Math.random() * status.length)],
      grand_total: commissionPrice
    }
  }
  
  const orderDetailDummy = [...Array(20)].map((detail, index) => {
    return {
      request_detail: faker.lorem.sentence(8),
      reference_image: faker.image.abstract(),
      order_id: index + 1
    }
  })

   await queryInterface.bulkInsert('orders', orderDummy)
   await queryInterface.bulkInsert('order_details', orderDetailDummy)
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
     await queryInterface.sequelize.query('SET FOREIGN_KEY_CHECKS = 0')
     await queryInterface.bulkDelete('orders', null, {truncate: true})
     await queryInterface.sequelize.query('SET FOREIGN_KEY_CHECKS = 1')
  }
};
