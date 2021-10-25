"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Item extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(db) {
      Item.belongsTo(db.User, {
        foreignKey: "userId",
        targetKey: "id",
      });
      Item.belongsTo(db.Post, {
        foreignKey: "postId",
        targetKey: "postId",
      });
    }
  }
  Item.init(
    {
      itemName: DataTypes.STRING,
      itemUrl: DataTypes.STRING,
      itemCategory: DataTypes.STRING,
      userId: DataTypes.INTEGER,
      postId: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "Item",
    }
  );
  return Item;
};
