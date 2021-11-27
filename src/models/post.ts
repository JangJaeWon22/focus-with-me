import { Model } from "sequelize";
// const { Model } = require("sequelize");
interface PostsAttributes {
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
  class Post extends Model<PostsAttributes> implements PostsAttributes {
    postId: number;
    coverOriginal: string;
    coverCropped: string;
    title: string;
    categorySpace: string;
    categoryStudyMate: string;
    categoryInterest: string;
    contentEditor: string;
    date: Date;
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(db: any) {
      Post.belongsTo(db.User, {
        foreignKey: "userId",
        targetKey: "userId",
        onDelete: "cascade",
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
      Post.hasMany(db.ChildComment, {
        foreignKey: "postId",
        sourceKey: "postId",
      });
      Post.hasMany(db.CommentLike, {
        foreignKey: "postId",
        sourceKey: "postId",
      });
    }
  }
  Post.init(
    {
      postId: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
        unique: true,
      },
      // imageCover: {
      //   type: DataTypes.STRING,
      // },
      coverOriginal: { type: DataTypes.STRING },
      coverCropped: { type: DataTypes.STRING },
      title: {
        allowNull: false,
        type: DataTypes.STRING,
      },
      categorySpace: {
        type: DataTypes.STRING,
      },
      categoryStudyMate: {
        type: DataTypes.STRING,
      },
      categoryInterest: {
        type: DataTypes.STRING,
      },
      contentEditor: {
        type: DataTypes.TEXT,
      },
      date: {
        allowNull: false,
        type: DataTypes.DATE,
      },
    },
    {
      sequelize,
      modelName: "Post",
      timestamps: false,
      charset: "utf8",
      collate: "utf8_general_ci",
    }
  );
  return Post;
};
