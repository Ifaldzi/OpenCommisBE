'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    await queryInterface.addColumn('illustrators', 'deleted_at', {
      type: Sequelize.DATE,
      allowNull: true
    })

    await queryInterface.addColumn('consumers', 'deleted_at', {
      type: Sequelize.DATE,
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
    await queryInterface.removeColumn('illustrators', 'deleted_at')

    await queryInterface.removeColumn('consumers', 'deleted_at')
  }
};
