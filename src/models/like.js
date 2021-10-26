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
        targetKey: "id",
      });
    }
  }
  Like.init(
    {
      postId: DataTypes.INTEGER,
      userId: DataTypes.INTEGER,
      date: DataTypes.DATE,
    },
    {
      sequelize,
      modelName: "Like",
      timestamps: false,
    }
  );
  return Like;
};
