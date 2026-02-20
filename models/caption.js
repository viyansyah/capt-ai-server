'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Caption extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Caption.belongsTo(models.User, {
        foreignKey: "userId",
        onDelete: "CASCADE",
        onUpdate: "CASCADE"
      });
    }
  }
  Caption.init({
    prompt: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: "Prompt is required"
        },
        notNull: {
          msg: "Prompt is required"
        }
      }
    },
    tone: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: "Tone is required"
        },
        notNull: {
          msg: "Tone is required"
        }
      }
    },
    platform: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: "Platform is required"
        },
        notNull: {
          msg: "Platform is required"
        }
      }
    },
    generatedText: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: "Generated Text is required"
        },
        notNull: {
          msg: "Generated Text is required"
        }
      }
    },
    imageUrl: {
      type: DataTypes.STRING,
      allowNull: true,
    } 
  }, {
    sequelize,
    modelName: 'Caption',
  });
  return Caption;
};