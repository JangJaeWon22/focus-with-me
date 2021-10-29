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
        targetKey: "id",
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
    }
  }
  Post.init(
    {
      postId: {
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      imageCover: DataTypes.STRING,
      title: DataTypes.STRING,
      categorySpace: DataTypes.STRING,
      categoryStudyMate: DataTypes.STRING,
      categoryInterest: DataTypes.STRING,
      imageContent: DataTypes.STRING,
      textContent: DataTypes.TEXT,
      youtubeUrl: DataTypes.STRING,
      userId: DataTypes.INTEGER,
      date: DataTypes.DATE,
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
