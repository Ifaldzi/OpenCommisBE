'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Withdrawal extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({ Illustrator }) {
      // define association here
      this.belongsTo(Illustrator, { as: 'illustrator', foreignKey: 'illustratorId' })
    }
  }
  Withdrawal.init({
    destination: {
      type: DataTypes.STRING,
      allowNull: false
    },
    accountNumber: {
      type: DataTypes.STRING(30),
      allowNull: false
    },
    amount: {
      type: DataTypes.DOUBLE,
      allowNull: false
    },
    disburseRefId: {
      type: DataTypes.STRING,
      allowNull: false
    },
    status: {
      type: DataTypes.STRING(10),
      allowNull: false
    },
    failureCode: {
      type: DataTypes.STRING(25),
      allowNull: true
    }
  }, {
    sequelize,
    modelName: 'Withdrawal',
    underscored: true,
  });
  return Withdrawal;
};