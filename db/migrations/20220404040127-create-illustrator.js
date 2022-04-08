'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('illustrators', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      name: {
        type: Sequelize.STRING(50),
        allowNull: false
      },
      email: {
        type: Sequelize.STRING(100),
        allowNull: false
      },
      username: {
        type: Sequelize.STRING(25),
        allowNull: false,
        unique: true
      },
      password: {
        type: Sequelize.STRING,
        allowNull: false
      },
      balance: {
        type: Sequelize.DOUBLE,
        defaultValue: 0,
        allowNull: false
      },
      phone: {
        type: Sequelize.STRING(15),
        allowNull: false
      },
      profile_picture: {
        type: Sequelize.STRING
      },
      available: {
        type: Sequelize.BOOLEAN
      },
      activation_token: {
        type: Sequelize.STRING
      },
      email_verified: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
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
    await queryInterface.dropTable('illustrators');
  }
};