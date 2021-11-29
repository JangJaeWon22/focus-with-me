import { BuildOptions, DataTypes, Model, Sequelize } from 'sequelize';

interface CommentAttributes {
  commentId?: number
  date: Date
  textContent: string
  userId: number
  postId: number
}

export interface CommentModel extends Model<CommentAttributes>, CommentAttributes {}
export class Comment extends Model<CommentModel, CommentAttributes> {}

export type CommentStatic = typeof Model & {
  new (values?: object, options?: BuildOptions): CommentModel;
};

export function CommentFactory(sequelize: Sequelize): CommentStatic {
  return <CommentStatic>sequelize.define(
    'Comment',
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
      modelName: "Comment",
      timestamps: false,
      charset: "utf8",
      collate: "utf8_general_ci",
    }
  );
};
