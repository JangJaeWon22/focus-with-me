import { Model } from "sequelize";

// These are all the attributes in the User model
interface BookmarkAttributes {
  bookmarkId: number;
  // userId: number;
  // postId: number;
  date: Date;
}

module.exports = (sequelize: any, DataTypes: any) => {
  class Bookmark extends Model<BookmarkAttributes>
  implements BookmarkAttributes {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
     bookmarkId!: number;
    //  userId: number;
    //  postId: number;
     date: Date;
    static associate(db: any) {
      Bookmark.belongsTo(db.Post, {
        foreignKey: "postId",
        targetKey: "postId",
        onDelete: "cascade",
      });
      Bookmark.belongsTo(db.User, {
        foreignKey: "userId",
        targetKey: "userId",
        onDelete: "cascade",
      });
    }
  }
  Bookmark.init(
    {
      bookmarkId: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
        unique: true,
      },
      date: {
        allowNull: false,
        type: DataTypes.DATE,
      },
    },
    {
      sequelize,
      modelName: "Bookmark",
      timestamps: false,
      charset: "utf8",
      collate: "utf8_general_ci",
    }
  );
  return Bookmark;
};
