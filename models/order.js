'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Order extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({ CommissionPost, Consumer, OrderDetail }) {
      // define association here
      this.belongsTo(CommissionPost, { as: 'commission', foreignKey: 'commissionPostId'})
      this.belongsTo(Consumer, { as: 'consumer' })
      this.hasOne(OrderDetail, { as: 'detail', foreignKey: 'orderId' })
    }

    toJSON() {
      return {
        ...this.get(),
        commissionPostId: undefined,
        consumerId: undefined
      }
    }
  }
  Order.init({
    status: {
      type: DataTypes.STRING(10),
      allowNull: false,
      defaultValue: 'CREATED',
      validate: {
        isIn: [['CREATED', 'ACCEPTED', 'DENIED', 'NOT_PAID', 'ON_WORK', 'FAILED', 'SENT', 'FINISHED']]
      }
    },
    grandTotal: {
      type: DataTypes.DOUBLE,
      allowNull: false
    },
    orderDate: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: new Date()
    }
  }, {
    sequelize,
    modelName: 'Order',
    underscored: true,
    timestamps: false,
    scopes: {
      pagination: (limit, page) => {
        return {
          // attributes: {
          //   exclude: ['CategoryId', 'IllustratorId']
          // },
          limit,
          offset: (page - 1) * limit,
          subQuery: false
        }
      }
    }
  });
  return Order;
};