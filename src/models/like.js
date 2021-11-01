"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Like extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(db) {
      Like.belongsTo(db.Post, {
        foreignKey: "postId",
        targetKey: "postId",
      });
      Like.belongsTo(db.User, {
        foreignKey: "userId",
        targetKey: "userId",
      });
    }
  }
  Like.init(
    {
      likeId: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
        unique: true,
      },
      postId: {
        allowNull: false,
        type: DataTypes.INTEGER,
      },
      userId: {
        allowNull: false,
        type: DataTypes.INTEGER,
      },
      date: {
        allowNull: false,
        type: DataTypes.DATE,
      },
    },
    {
      sequelize,
      modelName: "Like",
      timestamps: false,
      charset: "utf8",
      collate: "utf8_general_ci",
    }
  );
  return Like;
};
