'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class portfolio extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  portfolio.init({
    bio: DataTypes.TEXT,
    instagram_acc: DataTypes.STRING,
    twitter_acc: DataTypes.STRING,
    facebook_acc: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'portfolio',
    underscored: true,
  });
  return portfolio;
};