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
        foreignKey: "userName",
        targetKey: "nickname",
      });
      Post.hasMany(db.Item, {
        foreignKey: "postId",
        sourceKey: "postId",
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
      categoryStudyMates: DataTypes.STRING,
      categoryInterests: DataTypes.STRING,
      imageContents: DataTypes.STRING,
      textContent: DataTypes.STRING,
      youtubeUrl: DataTypes.STRING,
      userName: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Post",
    }
  );
  return Post;
};
