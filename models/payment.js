'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Payment extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({ Order }) {
      // define association here
      this.belongsTo(Order, { as: 'order' })
    }

    toJSON() {
      return {
        ...this.get(),
        orderId: undefined,
        invoiceRefId: undefined
      }
    }
  }
  Payment.init({
    paymentMethod: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    paymentDate: {
      type: DataTypes.DATE,
      allowNull: true
    },
    paymentLink: {
      type: DataTypes.STRING,
      allowNull: false
    },
    invoiceRefId: {
      type: DataTypes.STRING,
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'Payment',
    underscored: true,
    timestamps: false
  });
  return Payment;
};