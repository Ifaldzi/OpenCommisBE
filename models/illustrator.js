'use strict';
const bcrypt = require('bcrypt')
const { hash, baseUrl } = require('../config/config')

const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Illustrator extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({CommissionPost, Portfolio, Artwork, Withdrawal}) {
      // define association here
      this.hasMany(CommissionPost, {as: 'commissionPosts'})
      this.hasOne(Portfolio, { as: 'portfolio', foreignKey: 'illustrator_id' })
      this.hasMany(Artwork, { as: 'artworks' })
      this.hasMany(Withdrawal, { as: 'withdrawals', foreignKey: 'illustratorId' })
    }

    toJSON() {
      let substr
      const profilePicture = ((substr = this.profilePicture?.substr(0, 4)) == 'http' || substr == undefined) ? this.profilePicture : `${baseUrl}/${this.profilePicture}`

      return {
        ...this.get(),
        password: undefined,
        activationToken: undefined,
        profilePicture: profilePicture
      }
    }

    async verifyPassword(password) {
      return await bcrypt.compare(password, this.password)
    }

    async addBalance(amount) {
      this.balance += amount
      await this.save()
    }
  }
  
  Illustrator.init({
    name: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    password: {
      type: DataTypes.STRING(50),
      allowNull: false,
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
    phone: {
      type: DataTypes.STRING(15),
      allowNull: false,
    },
    balance: {
      type: DataTypes.DOUBLE,
      allowNull: false,
      defaultValue: 0
    },
    profilePicture: {
      type: DataTypes.STRING
    },
    available: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true
    },
    activationToken: {
      type: DataTypes.STRING,
    },
    emailVerified: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    }
  }, {
    sequelize,
    modelName: 'Illustrator',
    underscored: true,
  },);

  Illustrator.beforeCreate(async (illustrator, options) => {
    const salt = await bcrypt.genSalt(hash.saltRounds)
    illustrator.password = await bcrypt.hash(illustrator.password, salt)    
  })

  return Illustrator;
};