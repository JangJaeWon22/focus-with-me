import { Model } from "sequelize";

interface CommentAttr {
  commentId: number
  date: Date
  textContent: string
}


module.exports =  (sequelize: any, DataTypes: any) => {
  class Comment extends Model<CommentAttr>
  implements CommentAttr {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
     commentId: number
     date: Date
     textContent: string

    static associate(db: any) {
      Comment.hasMany(db.ChildComment, {
        foreignKey: "commentId",
        sourceKey: "commentId",
      });
      Comment.hasMany(db.CommentLike, {
        foreignKey: "commentId",
        sourceKey: "commentId",
      });
      Comment.hasMany(db.ChildComment, {
        foreignKey: "commentId",
        sourceKey: "commentId",
      });
      Comment.belongsTo(db.User, {
        foreignKey: "userId",
        targetKey: "userId",
        onDelete: "cascade",
      });
      Comment.belongsTo(db.Post, {
        foreignKey: "postId",
        targetKey: "postId",
        onDelete: "cascade",
      });
    }
  }
  Comment.init(
    {
      commentId: {
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
      modelName: "Comment",
      timestamps: false,
      charset: "utf8",
      collate: "utf8_general_ci",
    }
  );
  return Comment;
};
