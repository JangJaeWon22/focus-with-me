"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class CommentLike extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(db) {
      CommentLike.belongsTo(db.User, {
        foreignKey: "userId",
        targetKey: "userId",
      });
      CommentLike.belongsTo(db.Post, {
        foreignKey: "postId",
        targetKey: "postId",
      });
      CommentLike.belongsTo(db.Comment, {
        foreignKey: "commentId",
        targetKey: "commentId",
      });
    }
  }
  CommentLike.init(
    {
      commentLikeId: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      date: {
        type: DataTypes.DATE,
      },
    },
    {
      sequelize,
      modelName: "CommentLike",
      timestamps: false,
      charset: "utf8",
      collate: "utf8_general_ci",
    }
  );
  return CommentLike;
};
