import { BuildOptions, DataTypes, Model, Sequelize } from 'sequelize';

interface ChildCommentAttributes {
  childCommentId?: number
  userId?: number;
  postId?: number;
  commentId?: number
  textContent?: string;
  date?: Date;
}

export interface ChildCommentModel extends Model<ChildCommentAttributes>, ChildCommentAttributes {}
export class ChildComment extends Model<ChildCommentModel, ChildCommentAttributes> {}

export type ChildCommentStatic = typeof Model & {
  new (values?: object, options?: BuildOptions): ChildCommentModel;
};

export function ChildCommentFactory(sequelize: Sequelize): ChildCommentStatic {
  return <ChildCommentStatic>sequelize.define(
    'ChildComment',
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
      modelName: "ChildComment",
      timestamps: false,
      charset: "utf8",
      collate: "utf8_general_ci",
    }
  );
};
