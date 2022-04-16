'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    await queryInterface.removeConstraint('orders', 'orders_order_detail_id_foreign_idx')
    await queryInterface.removeColumn('orders', 'order_detail_id')
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
     await queryInterface.addColumn('orders', 'order_detail_id', {
      type: Sequelize.INTEGER,
      references: {
        model: {
          tableName: 'order_details'
        },
        key: 'id'
      },
      onDelete: 'CASCADE',
      allowNull: false
    })
  }
};
