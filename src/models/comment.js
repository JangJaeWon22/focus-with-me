"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Comment extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(db) {
      Comment.hasMany(db.CommentLike, {
        foreignKey: "commentId",
        sourceKey: "commentId",
      });
      Comment.belongsTo(db.User, {
        foreignKey: "userId",
        targetKey: "userId",
      });
      Comment.belongsTo(db.Post, {
        foreignKey: "postId",
        targetKey: "postId",
      });
    }
  }
  Comment.init(
    {
      commentId: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
        unique: true,
      },
      userId: {
        allowNull: false,
        type: DataTypes.INTEGER,
      },
      postId: {
        allowNull: false,
        type: DataTypes.INTEGER,
      },
      textContent: {
        allowNull: false,
        type: DataTypes.STRING,
      },
      date: {
        allowNull: false,
        type: DataTypes.DATE,
      },
    },
    {
      sequelize,
      modelName: "Comment",
      timestamps: false,
      charset: "utf8",
      collate: "utf8_general_ci",
    }
  );
  return Comment;
};
