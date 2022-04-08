'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class CommissionPost extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({ Illustrator, Category, Tag }) {
      // define association here
      this.belongsTo(Illustrator, {as: 'illustrator'})
      this.belongsTo(Category, {as: 'category'})
      this.belongsToMany(Tag, {through: 'commission_tags'})
    }
  }
  CommissionPost.init({
    tittle: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    duration_time: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        isInt: true,
      }
    },
    price: {
      type: DataTypes.DOUBLE,
      allowNull: false,
      validate: {
        isNumeric: true
      }
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    status: {
      type: DataTypes.STRING(6),
      allowNull: false,
      defaultValue: "OPEN",
      validate: {
        isIn: ['OPEN', 'CLOSED']
      }
    },
    image_1: {
      type: DataTypes.STRING,
      allowNull: false
    },
    image_2: DataTypes.STRING,
    image_3: DataTypes.STRING,
    image_4: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'CommissionPost',
    underscored: true,
  });
  return CommissionPost;
};