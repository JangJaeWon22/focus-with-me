"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(db) {
      User.hasMany(db.Post, {
        foreignKey: "userName",
        sourceKey: "nickname",
      });
      User.hasMany(db.Comment, {
        foreignKey: "userName",
        sourceKey: "nickname",
      });
      User.hasMany(db.Item, {
        foreignKey: "userName",
        sourceKey: "nickname",
      });
      User.hasMany(db.Like, {
        foreignKey: "userName",
        sourceKey: "nickname",
      });
      User.hasMany(db.Bookmark, {
        foreignKey: "userName",
        sourceKey: "nickname",
      });
    }
  }
  User.init(
    {
      email: DataTypes.STRING,
      nickname: DataTypes.STRING,
      password: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "User",
    }
  );
  return User;
};
