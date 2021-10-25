"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Bookmark extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(db) {
      Bookmark.belongsTo(db.Post, {
        foreignKey: "postId",
        targetKey: "postId",
      });
      Bookmark.belongsTo(db.User, {
        foreignKey: "userId",
        targetKey: "id",
      });
    }
  }
  Bookmark.init(
    {
      postiId: DataTypes.INTEGER,
      userId: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "Bookmark",
    }
  );
  return Bookmark;
};
