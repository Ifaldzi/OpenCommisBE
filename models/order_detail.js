'use strict';
const {
  Model
} = require('sequelize');
const { baseUrl } = require('../config/config');
module.exports = (sequelize, DataTypes) => {
  class OrderDetail extends Model {
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
        referenceImage: this.referenceImage !== null ? `${baseUrl}/${this.referenceImage}` : null
      }
    }
  }
  OrderDetail.init({
    requestDetail: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    referenceImage: {
      type: DataTypes.STRING
    }
  }, {
    sequelize,
    modelName: 'OrderDetail',
    underscored: true,
    timestamps: false
  });

  OrderDetail.removeAttribute('id')

  return OrderDetail;
};