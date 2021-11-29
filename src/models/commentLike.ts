import { BuildOptions, DataTypes, Model, Sequelize } from 'sequelize';

interface CommentLikeAttributes {
  commentLikeId?: number
  date: Date
  postId?:number
  userId?:number
  commentId?:number
}

export interface CommentLikeModel extends Model<CommentLikeAttributes>, CommentLikeAttributes {}
export class CommentLike extends Model<CommentLikeModel, CommentLikeAttributes> {}

export type CommentLikeStatic = typeof Model & {
  new (values?: object, options?: BuildOptions): CommentLikeModel;
};

export function CommentLikeFactory(sequelize: Sequelize): CommentLikeStatic {
  return <CommentLikeStatic>sequelize.define(
    'CommentLike',
    {
      commentLikeId: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      date: {
        type: DataTypes.DATE,
      },
    },
    {
      modelName: "Commentlike",
      timestamps: false,
      charset: "utf8",
      collate: "utf8_general_ci",
    }
  );
};


    
    
      
  
