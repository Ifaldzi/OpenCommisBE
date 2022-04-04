'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class commissionPost extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  commissionPost.init({
    tittle: DataTypes.STRING,
    duration_time: DataTypes.INTEGER,
    price: DataTypes.DOUBLE,
    desctiption: DataTypes.TEXT,
    status: DataTypes.STRING,
    image_1: DataTypes.STRING,
    image_2: DataTypes.STRING,
    image_3: DataTypes.STRING,
    image_4: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'commissionPost',
    underscored: true,
  });
  return commissionPost;
};