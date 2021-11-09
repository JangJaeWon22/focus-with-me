"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Post extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(db) {
      Post.belongsTo(db.User, {
        foreignKey: "userId",
        targetKey: "userId",
      });
      Post.hasMany(db.Like, {
        foreignKey: "postId",
        sourceKey: "postId",
      });
      Post.hasMany(db.Bookmark, {
        foreignKey: "postId",
        sourceKey: "postId",
      });
      Post.hasMany(db.Comment, {
        foreignKey: "postId",
        sourceKey: "postId",
      });
      Post.hasMany(db.CommentLike, {
        foreignKey: "postId",
        sourceKey: "postId",
      });
    }
  }
  Post.init(
    {
      postId: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
        unique: true,
      },
      imageCover: {
        type: DataTypes.STRING,
      },
      title: {
        allowNull: false,
        type: DataTypes.STRING,
      },
      categorySpace: {
        type: DataTypes.STRING,
      },
      categoryStudyMate: {
        type: DataTypes.STRING,
      },
      categoryInterest: {
        type: DataTypes.STRING,
      },
      contentEditor: {
        type: DataTypes.TEXT,
      },
      date: {
        allowNull: false,
        type: DataTypes.DATE,
      },
    },
    {
      sequelize,
      modelName: "Post",
      timestamps: false,
      charset: "utf8",
      collate: "utf8_general_ci",
    }
  );
  return Post;
};
