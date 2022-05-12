'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    await queryInterface.changeColumn('illustrators', 'email', {
        type: Sequelize.STRING(100),
        allowNull: false,
        unique: true
    })

    await queryInterface.changeColumn('consumers', 'email', {
      type: Sequelize.STRING(100),
      allowNull: false,
      unique: true
  })
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
  }
};
