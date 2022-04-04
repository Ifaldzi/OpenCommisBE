'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('reviews', {
      consumer_id: {
        type: Sequelize.INTEGER,
        references: {
          model: {
            tableName: 'consumers',
          },
          key: 'id'
        },
        allowNull: false
      },
      commission_post_id: {
        type: Sequelize.INTEGER,
        references: {
          model: {
            tableName: 'commission_posts'
          },
          key: 'id'
        },
        allowNull: false
      },
      rating: {
        type: Sequelize.INTEGER(1),
        allowNull: false
      },
      comment: {
        type: Sequelize.TEXT
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('reviews');
  }
};