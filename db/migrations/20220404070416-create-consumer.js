'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('consumers', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      name: {
        allowNull: false,
        type: Sequelize.STRING(50)
      },
      email: {
        allowNull: false,
        type: Sequelize.STRING(100)
      },
      username: {
        allowNull: false,
        type: Sequelize.STRING(25),
        unique: true,
      },
      password: {
        type: Sequelize.STRING(50),
        allowNull: false
      },
      phone: {
        type: Sequelize.STRING(15),
        allowNull: false
      },
      activation_token: {
        type: Sequelize.STRING
      },
      email_verified: {
        type: Sequelize.BOOLEAN,
        default: false
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
    await queryInterface.dropTable('consumers');
  }
};