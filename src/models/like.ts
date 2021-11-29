import { BuildOptions, DataTypes, Model, Sequelize } from 'sequelize';

interface LikeAttributes {
  likeId?: number;
  date: Date;
  postId?: number;
  userId?: number
}

export interface LikeModel extends Model<LikeAttributes>, LikeAttributes {}
export class Like extends Model<LikeModel, LikeAttributes> {}

export type LikeStatic = typeof Model & {
  new (values?: object, options?: BuildOptions): LikeModel;
};

export function LikeFactory(sequelize: Sequelize): LikeStatic {
  return <LikeStatic>sequelize.define(
      'User',
    {
      likeId: {
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
      modelName: "Like",
      timestamps: false,
      charset: "utf8",
      collate: "utf8_general_ci",
    }
  );
};
