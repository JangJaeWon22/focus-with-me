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
      Comment.belongsTo(db.User, {
        foreignKey: "userName",
        targetKey: "nickname",
      });
      Comment.belongsTo(db.Post, {
        foreignKey: "postId",
        targetKey: "postId",
      });
    }
  }
  Comment.init(
    {
      userName: DataTypes.STRING,
      postId: DataTypes.INTEGER,
      textContent: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Comment",
    }
  );
  return Comment;
};
