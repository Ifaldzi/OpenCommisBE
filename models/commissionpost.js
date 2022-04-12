'use strict';
const {
  Model
} = require('sequelize');
const { baseUrl } = require('../config/config');
const { ForbiddenError } = require('../errors');
const NotFoundError = require('../errors/NotFoundError');
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

    static async findOneByIdFromIllustrator(commissionId, illustratorId) {
      const commission = await this.findOne({
        where: {
          id: commissionId
        }
      })

      if (!commission)
        throw new NotFoundError()

      if (commission.illustratorId !== illustratorId)
        throw new ForbiddenError()

      return commission
    }

    toJSON() {
      let substr
      const image_1 = this.image_1.substr(0, 4) === 'http' ? this.image_1 : `${baseUrl}/${this.image_1}`
      const image_2 = ((substr = this.image_2?.substr(0, 4)) == 'http' || substr == undefined) ? this.image_2 : `${baseUrl}/${this.image_2}`
      const image_3 = ((substr = this.image_3?.substr(0, 4)) == 'http' || substr == undefined) ? this.image_3 : `${baseUrl}/${this.image_3}`
      const image_4 = ((substr = this.image_4?.substr(0, 4)) == 'http' || substr == undefined) ? this.image_4 : `${baseUrl}/${this.image_4}`

      return {
        ...this.get(),
        image_1: image_1,
        image_2: image_2,
        image_3: image_3,
        image_4: image_4,
        category: this.category !== undefined ? this.category.categoryName : undefined,
        tags: this.tags !== undefined ? this.get().tags.map((tag) => tag.tagName) : undefined,
        illustrator: this.get().illustrator !== undefined ? {
          id: this.get().illustrator.id,
          name: this.get().illustrator.name,
          username: this.get().illustrator.username
        } : undefined,
        categoryId: undefined,
        illustratorId: undefined
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
        isIn: [['OPEN', 'CLOSED']]
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
        exclude: ['CategoryId', 'IllustratorId']
      }
    },
    scopes: {
      pagination: (limit, page) => {
        return {
          attributes: {
            exclude: ['CategoryId', 'IllustratorId']
          },
          limit,
          offset: (page - 1) * limit,
          subQuery: false
        }
      }
    }
  });
  return CommissionPost;
};