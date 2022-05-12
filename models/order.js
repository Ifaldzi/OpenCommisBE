'use strict';
const {
  Model
} = require('sequelize');
const { ForbiddenError } = require('../errors');
const NotFoundError = require('../errors/NotFoundError');
module.exports = (sequelize, DataTypes) => {
  class Order extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({ CommissionPost, Consumer, OrderDetail, Payment }) {
      // define association here
      this.belongsTo(CommissionPost, { as: 'commission', foreignKey: 'commissionPostId'})
      this.belongsTo(Consumer, { as: 'consumer' })
      this.hasOne(OrderDetail, { as: 'detail', foreignKey: 'orderId' })
      this.hasOne(Payment, { as: 'payment', foreignKey: 'orderId' })
    }

    static async findOneWhichBelongsToIllustrator(orderId, illustratorId) {
      const order = await this.findOne({ 
        where: { id: orderId },
        include: ['detail', 'commission', { association: 'consumer', paranoid: false }]
      })
      if (!order)
        throw new NotFoundError()

      if (order.commission.illustratorId !== illustratorId)
        throw new ForbiddenError()

      return order
    }

    static async findOneWhichBelongsToConsumer(orderId, consumerId) {
      const order = await this.findOne({ 
        where: { id: orderId },
        include: ['detail', 'commission', { association: 'consumer', paranoid: false}]
      })
      if (!order)
        throw new NotFoundError()

      if (order.consumer.id !== consumerId)
        throw new ForbiddenError()

      return order 
    }

    toJSON() {
      return {
        ...this.get(),
        commission: this.commission !== undefined ? {
          ...this.commission.toJSON(),
          illustrator: undefined
        } : undefined,
        illustrator: this.commission?.illustrator,
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
    },
    reviewed: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    }
  }, {
    sequelize,
    modelName: 'Order',
    underscored: true,
    timestamps: false,
    scopes: {
      pagination: (limit, page) => {
        return {
          limit,
          offset: (page - 1) * limit,
          subQuery: false
        }
      }
    }
  });
  return Order;
};