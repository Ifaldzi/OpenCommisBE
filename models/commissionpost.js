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
      this.belongsToMany(Tag, {
        through: 'commission_tags', 
        foreignKey: 'commission_post_id', 
        as: 'tags', 
        timestamps: false
      })
    }

    toJSON() {
      return {
        ...this.get(), 
        category: this.category.categoryName,
        tags: this.get().tags.map((tag) => tag.tagName),
        illustrator: this.get().illustrator !== undefined ? {
          id: this.get().illustrator.id,
          name: this.get().illustrator.name,
          username: this.get().illustrator.username
        } : undefined
      }
    }
  }
  CommissionPost.init({
    title: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    durationTime: {
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
    defaultScope: {
      attributes: {
        exclude: ['illustratorId', 'categoryId', 'CategoryId', 'IllustratorId']
      }
    }
  });
  return CommissionPost;
};