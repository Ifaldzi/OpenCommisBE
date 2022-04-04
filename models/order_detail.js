'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class order_detail extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  order_detail.init({
    request_detai: DataTypes.TEXT,
    reference_image: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'order_detail',
    underscored: true,
  });
  return order_detail;
};