import { Model } from "sequelize";

interface commentLikeAttr {
  commentLikeId: number;
  date: Date;
}

export function commentLikeFactory (sequelize: any, DataTypes: any){
  class likecmt extends Model<commentLikeAttr>
  implements commentLikeAttr {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    commentLikeId!: number;
    date: Date;

  static associate(db: any) {
    likecmt.belongsTo(db.Post, {
      foreignKey: "userId",
      targetKey: "userId",
      onDelete: "cascade",
    });
    likecmt.belongsTo(db.Comment, {
      foreignKey: "commentId",
      targetKey: "commentId",
      onDelete: "cascade",
    });
  }
  }
  likecmt.init(
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
      sequelize,
      modelName: "likecmt",
      timestamps: false,
      charset: "utf8",
      collate: "utf8_general_ci",
    }
  );
  return likecmt;
};


    
    
      
  
