'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    await queryInterface.addColumn('payments', 'order_id', {
      type: Sequelize.INTEGER,
      references: {
        model: {
          tableName: 'orders'
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
    await queryInterface.removeColumn('payments', 'order_id')
  }
};
