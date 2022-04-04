'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    await queryInterface.addColumn('orders', 'commission_post_id', {
      type: Sequelize.INTEGER,
      references: {
        model: {
          tableName: 'commission_posts'
        },
        key: 'id'
      },
      onDelete: 'CASCADE',
      allowNull: false
    })

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

    await queryInterface.addColumn('orders', 'payment_id', {
      type: Sequelize.INTEGER,
      references: {
        model: {
          tableName: 'payments'
        },
        key: 'id'
      },
      onDelete: 'CASCADE',
      allowNull: true
    })

    await queryInterface.addColumn('orders', 'consumer_id', {
      type: Sequelize.INTEGER,
      references: {
        model: {
          tableName: 'consumers'
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
    await queryInterface.removeColumn('orders', 'commission_post_id')
    await queryInterface.removeColumn('orders', 'order_detail_id')
    await queryInterface.removeColumn('orders', 'payment_id')
    await queryInterface.removeColumn('orders', 'consumer_id')
  }
};
