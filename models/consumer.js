'use strict';
const {
  Model
} = require('sequelize');
const bcrypt = require('bcrypt')
const { hash } = require('../config/config')
const { baseUrl } = require('../config/config')
module.exports = (sequelize, DataTypes) => {
  class Consumer extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({ Order, CommissionPost, Review }) {
      // define association here
      this.hasMany(Order, { as: 'orders', foreignKey: 'consumerId' })
      this.hasMany(Review, { as: 'reviews', foreignKey: 'consumerId' })
    }

    toJSON() {
      let substr
      const profilePicture = ((substr = this.profilePicture?.substr(0, 4)) == 'http' || substr == undefined) ? this.profilePicture : `${baseUrl}/${this.profilePicture}`

      return {
        ...this.get(),
        profilePicture: profilePicture,
        password: undefined,
        activationToken: undefined
      }
    }

    async verifyPassword(password) {
      return await bcrypt.compare(password, this.password)
    }
  }
  Consumer.init({
    name: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    email: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true
      }
    },
    username: {
      type: DataTypes.STRING(25),
      allowNull: false,
      unique: true
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    phone: {
      type: DataTypes.STRING(15),
      allowNull: false
    },
    profilePicture: {
      type: DataTypes.STRING,
    },
    activationToken: {
      type: DataTypes.STRING
    },
    emailVerified: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    }
  }, {
    sequelize,
    modelName: 'Consumer',
    underscored: true,
  });

  Consumer.beforeCreate(async (consumer, options) => {
    const salt = await bcrypt.genSalt(hash.saltRounds)
    consumer.password = await bcrypt.hash(consumer.password, salt)
  })

  return Consumer;
};