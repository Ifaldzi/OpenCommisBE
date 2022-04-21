'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
     await queryInterface.changeColumn('payments', 'payment_method', {
      type: Sequelize.STRING(20),
      allowNull: true
    })

    await queryInterface.changeColumn('payments', 'payment_date', {
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
     await queryInterface.changeColumn('payments', 'payment_method', {
      type: Sequelize.STRING(20),
      allowNull: false
    })

    await queryInterface.changeColumn('payments', 'payment_date', {
      type: Sequelize.DATE,
      allowNull: false
    })
  }
};
