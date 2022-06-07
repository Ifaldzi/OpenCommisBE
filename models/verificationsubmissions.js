'use strict';
const {
  Model
} = require('sequelize');
const { baseUrl } = require('../config/config');
module.exports = (sequelize, DataTypes) => {
  class VerificationSubmission extends Model {
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
        idCardPhoto: `${baseUrl}/${this.idCardPhoto}`,
        cardSelfiePhoto: `${baseUrl}/${this.cardSelfiePhoto}`,
        illustrator_id: undefined
      }
    }
  }
  VerificationSubmission.init({
    address: {
      type: DataTypes.STRING,
      allowNull: false
    },
    city: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    province: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    background: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    NIK: {
      type: DataTypes.STRING(20),
      allowNull: false,
      field: 'NIK'
    },
    accepted: {
      type: DataTypes.BOOLEAN,
      allowNull: true
    },
    idCardPhoto: {
      type: DataTypes.STRING,
      allowNull: false
    },
    cardSelfiePhoto: {
      type: DataTypes.STRING,
      allowNull: false
    },
    submissionDate: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    },
    verificationDate: {
      type: DataTypes.DATE,
      allowNull: true
    }
  }, {
    sequelize,
    modelName: 'VerificationSubmission',
    underscored: true,
    timestamps: false,
    defaultScope: {
      attributes: {
        exclude: ['illustrator_id']
      }
    }
  });

  VerificationSubmission.removeAttribute('id')

  return VerificationSubmission;
};