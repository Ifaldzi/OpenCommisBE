'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    await queryInterface.createTable('commission_tags', {
      commission_post_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'commission_posts',
          key: 'id'
        },
        onDelete: 'CASCADE',
        allowNull: false
      },

      tag_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'tags',
          key: 'id'
        },
        onDelete: 'CASCADE',
        allowNull: false
      }
    })
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    await queryInterface.dropTable('commission_tags')
  }
};
