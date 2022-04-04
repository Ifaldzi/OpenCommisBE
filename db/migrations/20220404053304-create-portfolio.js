'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('portfolios', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      bio: {
        allowNull: false,
        type: Sequelize.TEXT
      },
      instagram_acc: {
        type: Sequelize.STRING
      },
      twitter_acc: {
        type: Sequelize.STRING
      },
      facebook_acc: {
        type: Sequelize.STRING
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('portfolios');
  }
};