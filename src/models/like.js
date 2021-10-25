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
        foreignKey: "userName",
        targetKey: "nickname",
      });
    }
  }
  Like.init(
    {
      postId: DataTypes.INTEGER,
      userName: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Like",
    }
  );
  return Like;
};
