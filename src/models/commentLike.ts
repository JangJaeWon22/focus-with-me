import { Model } from "sequelize";

interface commentLikeAttr {
  commentLikeId: number;
  date: Date;
}

export function commentLikeFactory (sequelize: any, DataTypes: any){
  class Commentlike extends Model<commentLikeAttr>
  implements commentLikeAttr {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    commentLikeId!: number;
    date: Date;

  static associate(db: any) {
    Commentlike.belongsTo(db.Post, {
      foreignKey: "userId",
      targetKey: "userId",
      onDelete: "cascade",
    });
    Commentlike.belongsTo(db.Comment, {
      foreignKey: "commentId",
      targetKey: "commentId",
      onDelete: "cascade",
    });
  }
  }
  Commentlike.init(
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
      modelName: "Commentlike",
      timestamps: false,
      charset: "utf8",
      collate: "utf8_general_ci",
    }
  );
  return Commentlike;
};


    
    
      
  
