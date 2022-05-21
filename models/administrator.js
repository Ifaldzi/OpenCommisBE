'use strict';

const bcrypt = require('bcrypt')
const { hash, baseUrl } = require('../config/config')

const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Administrator extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }

    toJSON() {
      return {
        ...this.get(),
        password: undefined
      }
    }

    async verifyPassword(password) {
      return await bcrypt.compare(password, this.password)
    }
  }
  Administrator.init({
    username: {
      type: DataTypes.STRING(25),
      allowNull: false
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false
    },
    name: {
      type: DataTypes.STRING(50),
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'Administrator',
    underscored: true,
  });

  Administrator.beforeCreate(async (administrator, options) => {
    const salt = await bcrypt.genSalt(hash.saltRounds)
    administrator.password = await bcrypt.hash(administrator.password, salt) 
  })

  return Administrator;
};