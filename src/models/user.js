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
        foreignKey: "userId",
        sourceKey: "id",
      });
      User.hasMany(db.Comment, {
        foreignKey: "userId",
        sourceKey: "id",
      });
      User.hasMany(db.Like, {
        foreignKey: "userId",
        sourceKey: "id",
      });
      User.hasMany(db.Bookmark, {
        foreignKey: "userId",
        sourceKey: "id",
      });
    }
  }
  User.init(
    {
      id: {
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      email: DataTypes.STRING,
      nickname: DataTypes.STRING,
      password: DataTypes.STRING,
      avatarUrl: DataTypes.STRING,
      date: DataTypes.DATE,
    },
    {
      sequelize,
      modelName: "User",
      timestamps: false,
    }
  );
  return User;
};
