'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    await queryInterface.addColumn('portfolios', 'illustrator_id', {
      type: Sequelize.INTEGER,
      references: {
        model: {
          tableName: 'illustrators'
        },
        key: 'id'
      },
      onDelete: 'CASCADE',
      allowNull: false
    })
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    await queryInterface.removeColumn('portfolios', 'illustrator_id')
  }
};
