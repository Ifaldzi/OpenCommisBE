'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    await queryInterface.removeConstraint('illustrators', 'illustrators_portfolio_id_foreign_idx')
    await queryInterface.removeColumn('illustrators', 'portfolio_id')
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    await queryInterface.addColumn('illustrators', 'portfolio_id', {
      type: Sequelize.INTEGER,
      references: {
        model: {
          tableName: 'portfolios'
        },
        key: 'id'
      },
    })
  }
};
