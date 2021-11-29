import { BuildOptions, DataTypes, Model, Sequelize } from 'sequelize';

// These are all the attributes in the User model
interface BookmarkAttributes {
  bookmarkId?: number;
  userId: number;
  postId: number;
  date: Date;
}
export interface BookmarkModel extends Model<BookmarkAttributes>, BookmarkAttributes {}
export class Bookmark extends Model<BookmarkModel, BookmarkAttributes> {}

export type BookmarkStatic = typeof Model & {
  new (values?: object, options?: BuildOptions): BookmarkModel;
};

export function BookmarkFactory(sequelize: Sequelize): BookmarkStatic {
  return <BookmarkStatic>sequelize.define(
    'Bookmark',
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
      modelName: "Bookmark",
      timestamps: false,
      charset: "utf8",
      collate: "utf8_general_ci",
    }
  );
};
