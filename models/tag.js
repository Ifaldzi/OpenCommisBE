'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Tag extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({CommissionPost}) {
      // define association here
      this.belongsToMany(CommissionPost, {through: 'commission_tags', timestamps: false})
    }
  }
  Tag.init({
    tagName: {
      type: DataTypes.STRING(20),
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'Tag',
    underscored: true,
    timestamps: false
  });
  return Tag;
};