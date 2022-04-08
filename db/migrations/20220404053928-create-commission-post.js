'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('commission_posts', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      title: {
        allowNull: false,
        type: Sequelize.STRING(50)
      },
      duration_time: {
        allowNull: false,
        type: Sequelize.INTEGER
      },
      price: {
        allowNull: false,
        type: Sequelize.DOUBLE
      },
      description: {
        allowNull: false,
        type: Sequelize.TEXT
      },
      status: {
        allowNull: false,
        defaultValue: "OPEN",
        type: Sequelize.STRING(6)
      },
      image_1: {
        allowNull: false,
        type: Sequelize.STRING
      },
      image_2: {
        type: Sequelize.STRING
      },
      image_3: {
        type: Sequelize.STRING
      },
      image_4: {
        type: Sequelize.STRING
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('commission_posts');
  }
};