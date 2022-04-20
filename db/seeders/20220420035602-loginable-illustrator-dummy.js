'use strict';

const bcrypt = require('bcrypt')
const faker = require('@faker-js/faker').faker
const { hash } = require('../../config/config')

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
    const salt = await bcrypt.genSalt(hash.saltRounds)
    const hashedIllustratorPassword = await bcrypt.hash('12345678', salt)

    await queryInterface.bulkInsert('illustrators', [{
      name: 'Illustrator Test Account',
      email: 'illustrator@test.com',
      username: 'illustrator_test_acc',
      password: hashedIllustratorPassword,
      created_at: new Date(),
      updated_at: new Date(),
      phone: '088888888888'
    }])

    const illustratorId = await queryInterface.rawSelect('illustrators', {where: {username: 'illustrator_test_acc'}}, 'id')

    await queryInterface.bulkInsert('commission_posts', [{
      title: faker.lorem.sentence(3),
      duration_time: 7,
      price: 30000,
      description: faker.lorem.text(),
      image_1: faker.image.abstract(),
      image_2: faker.image.abstract(),
      created_at: new Date(),
      updated_at: new Date(),
      category_id: 2,
      illustrator_id: illustratorId
    }])

    const commissionId = await queryInterface.rawSelect('commission_posts', {where: {illustrator_id: illustratorId}}, 'id')

    await queryInterface.bulkInsert('commission_tags', [
      {commission_post_id: commissionId, tag_id: 2},
      {commission_post_id: commissionId, tag_id: 4},
    ])

    const orderDummy = []
    const orderDetail = []
    for (let i=1; i<=20; i++) {
      orderDummy.push({
        commission_post_id: commissionId,
        consumer_id: Math.floor(Math.random() * 20) + 1,
        order_date: faker.date.recent(14),
        status: status[Math.floor(Math.random() * status.length)],
        grand_total: 30000
      })
    }

    await queryInterface.bulkInsert('orders', orderDummy)

    let lastOrderId = await queryInterface.sequelize.query("SELECT LAST_INSERT_ID()")
    lastOrderId = Number(lastOrderId[0][0]['LAST_INSERT_ID()'])

    for (let i=0; i<20; i++) {
      orderDetail.push({
        request_detail: faker.lorem.sentence(8),
        reference_image: faker.image.abstract(),
        order_id: lastOrderId + i
      })
    }

    await queryInterface.bulkInsert('order_details', orderDetail)
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    await queryInterface.bulkDelete('illustrators', {username: 'illustrator_test_acc'})
  }
};
