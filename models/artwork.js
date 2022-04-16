'use strict';
const {
  Model
} = require('sequelize');
const { baseUrl } = require('../config/config');
const { ForbiddenError } = require('../errors');
const NotFoundError = require('../errors/NotFoundError');
module.exports = (sequelize, DataTypes) => {
  class Artwork extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({ Illustrator }) {
      // define association here
      this.belongsTo(Illustrator, { as: 'illustrator' })
    }

    static async findOneWhichBelongsToIllustrator(illustratorId, artworkId) {
      const artwork = await this.findOne({ where: { id: artworkId }})

      if (!artwork)
        throw new NotFoundError()

      if (artwork.illustratorId !== illustratorId)
        throw new ForbiddenError()

      return artwork
    }

    toJSON() {
      return {
        ...this.get(),
        image: this.image.substr(0, 4) === 'http' ? this.image : `${baseUrl}/${this.image}`,
        illustratorId: undefined
      }
    }
  }
  Artwork.init({
    image: {
      type: DataTypes.STRING,
      allowNull: false
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'Artwork',
    underscored: true,
    defaultScope: {
      attributes: {exclude: 'IllustratorId'}
    }
  });
  return Artwork;
};