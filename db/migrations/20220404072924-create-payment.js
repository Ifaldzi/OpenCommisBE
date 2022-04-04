'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('payments', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      payment_method: {
        type: Sequelize.STRING(20),
        allowNull: false
      },
      payment_date: {
        type: Sequelize.DATE,
        allowNull: false
      },
      payment_link: {
        type: Sequelize.STRING,
        allowNull: false
      },
      invoice_ref_id: {
        type: Sequelize.STRING,
        allowNull: false
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('payments');
  }
};