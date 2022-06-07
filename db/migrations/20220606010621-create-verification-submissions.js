'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('verification_submissions', {
      address: {
        type: Sequelize.STRING,
        allowNull: false
      },
      city: {
        type: Sequelize.STRING(50),
        allowNull: false
      },
      province: {
        type: Sequelize.STRING(50),
        allowNull: false
      },
      background: {
        type: Sequelize.TEXT,
        allowNull: false
      },
      NIK: {
        type: Sequelize.STRING(20),
        allowNull: false
      },
      accepted: {
        type: Sequelize.BOOLEAN,
        allowNull: true,
      },
      id_card_photo: {
        type: Sequelize.STRING,
        allowNull: false
      },
      card_selfie_photo: {
        type: Sequelize.STRING,
        allowNull: false
      },
      submission_date: {
        allowNull: false,
        type: Sequelize.DATE
      },
      verification_date: {
        allowNull: true,
        type: Sequelize.DATE
      },
      illustrator_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: {
            tableName: 'illustrators'
          },
          key: 'id'
        },
        onDelete: 'CASCADE'
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('verification_submissions');
  }
};