"use strict";
const { Model } = require("sequelize");

interface ChildAttributes {
  postId: number;
  coverOriginal: string;
  coverCropped: string;
  title: string;
  categorySpace: string;
  categoryStudyMate: string;
  categoryInterest: string;
  contentEditor: string;
  date: Date;
}

module.exports = (sequelize: any, DataTypes: any) => {
  class ChildComment extends Model<ChildAttributes> implements ChildAttributes {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(db) {
      ChildComment.belongsTo(db.User, {
        foreignKey: "userId",
        sourceKey: "userId",
        onDelete: "cascade",
      });
      ChildComment.belongsTo(db.Comment, {
        foreignKey: "commentId",
        sourceKey: "commentId",
        onDelete: "cascade",
      });
      ChildComment.belongsTo(db.Post, {
        foreignKey: "postId",
        targetKey: "postId",
        onDelete: "cascade",
      });
    }
  }
  ChildComment.init(
    {
      childCommentId: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
        unique: true,
      },
      textContent: {
        allowNull: false,
        type: DataTypes.STRING,
      },
      date: {
        allowNull: false,
        type: DataTypes.DATE,
      },
    },
    {
      sequelize,
      modelName: "ChildComment",
      timestamps: false,
      charset: "utf8",
      collate: "utf8_general_ci",
    }
  );
  return ChildComment;
};
