'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    await queryInterface.addColumn('commission_posts', 'illustrator_id', {
      type: Sequelize.INTEGER,
      references: {
        model: {
          tableName: 'illustrators'
        },
        key: 'id',
      },
      onDelete:'CASCADE',
      allowNull: false
    })

    await queryInterface.addColumn('commission_posts', 'category_id', {
      type: Sequelize.INTEGER,
      references: {
        model: {
          tableName: 'categories'
        },
        key: 'id'
      },
      allowNull: true
    })
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    await queryInterface.removeColumn('commission_posts', 'illustrator_id')
    await queryInterface.removeColumn('commission_posts', 'category_id')
  }
};
