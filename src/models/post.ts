import { BuildOptions, DataTypes, Model, Sequelize } from 'sequelize';

interface PostAttributes {
  postId?: number;
  userId?: number;
  coverOriginal: string;
  coverCropped: string;
  title: string;
  categorySpace: string;
  categoryStudyMate: string;
  categoryInterest: string;
  contentEditor: string;
  date: Date;
}

export interface PostModel extends Model<PostAttributes>, PostAttributes {}
export class Post extends Model<PostModel, PostAttributes> {}

export type PostStatic = typeof Model & {
  new (values?: object, options?: BuildOptions): PostModel;
};

export function PostFactory(sequelize: Sequelize): PostStatic {
  return <PostStatic>sequelize.define(
    'Post',
    {
      postId: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
        unique: true,
      },
      coverOriginal: { 
        type: DataTypes.STRING
      },
      coverCropped: {
        type: DataTypes.STRING 
      },
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
      modelName: "Post",
      timestamps: false,
      charset: "utf8",
      collate: "utf8_general_ci",
    }
  );
};
