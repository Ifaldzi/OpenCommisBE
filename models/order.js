'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class order extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  order.init({
    status: DataTypes.STRING,
    grand_total: DataTypes.DOUBLE,
    order_data: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'order',
    underscored: true,
  });
  return order;
};