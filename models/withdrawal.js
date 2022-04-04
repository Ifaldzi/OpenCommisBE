'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class withdrawal extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  withdrawal.init({
    destination: DataTypes.STRING,
    account_number: DataTypes.STRING,
    amount: DataTypes.DOUBLE,
    disburse_ref_id: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'withdrawal',
    underscored: true,
  });
  return withdrawal;
};