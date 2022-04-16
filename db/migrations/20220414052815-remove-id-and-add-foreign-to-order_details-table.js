'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    await queryInterface.removeColumn('order_details', 'id')
    await queryInterface.addColumn('order_details', 'order_id', {
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
    await queryInterface.addColumn('order_details', 'id', {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER
    })
    await queryInterface.removeColumn('order_details', 'order_id')
  }
};
