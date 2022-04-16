'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Portfolio extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({ Illustrator }) {
      // define association here
      this.belongsTo(Illustrator, { as: 'illustrator' })
    }

    toJSON() {
      return {
        ...this.get(),
        illustratorId: undefined
      }
    }
  }
  Portfolio.init({
    bio: {
      type: DataTypes.TEXT
    },
    instagramAcc: {
      type: DataTypes.STRING
    },
    twitterAcc: {
      type: DataTypes.STRING
    },
    facebookAcc: {
      type: DataTypes.STRING
    }
  }, {
    sequelize,
    modelName: 'Portfolio',
    underscored: true,
    timestamps: false,
    defaultScope: {
      attributes: {
        exclude: ['illustrator_id']
      }
    }
  });

  Portfolio.removeAttribute('id')

  return Portfolio;
};