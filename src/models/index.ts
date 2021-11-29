import * as Sequelize from 'sequelize';
import { config } from '../config/config';
import { UserFactory } from './user';
import { PostFactory } from './post';
import { LikeFactory } from './like';
import { CommentLikeFactory } from "./commentLike"
import { CommentFactory } from "./comment"
import { ChildCommentFactory } from "./childComment"
import { BookmarkFactory } from "./bookmark"

export const sequelize = new Sequelize.Sequelize(
  config.rds.database,
  config.rds.username,
  config.rds.password,
  {
    host: config.rds.host,
    dialect: 'mysql',
  }
);

export const User = UserFactory(sequelize);
export const Post = PostFactory(sequelize);
export const Like = LikeFactory(sequelize);
export const CommentLike = CommentLikeFactory(sequelize);
export const Comment = CommentFactory(sequelize);
export const ChildComment = ChildCommentFactory(sequelize);
export const Bookmark = BookmarkFactory(sequelize);

// User table 관계 설정
  User.hasMany(Post, { //완
    foreignKey: "userId",
    sourceKey: "userId",
  });
  User.hasMany(Comment, { //완
    foreignKey: "userId",
    sourceKey: "userId",
  });
  User.hasMany(ChildComment, { //완
    foreignKey: "userId",
    sourceKey: "userId",
  });
  User.hasMany(Like, { //완
    foreignKey: "userId",
    sourceKey: "userId",
  });
  User.hasMany(Bookmark, { //완
    foreignKey: "userId",
    sourceKey: "userId",
  }); 
  User.hasMany(CommentLike, { //완
    foreignKey: "userId",
    sourceKey: "userId",
  });
  User.belongsToMany(User, { //완
    foreignKey: "followingId",
    as: "Followers",
    through: "Follow",
    onDelete: "cascade",
  });
  User.belongsToMany(User, { //완
    foreignKey: "followerId",
    as: "Followings",
    through: "Follow",
    onDelete: "cascade",
  });

  //Post table 관계설정
  Post.belongsTo(User, { //완
    foreignKey: "userId",
    targetKey: "userId",
    onDelete: "cascade",
  });
  Post.hasMany(Like, { //완
    foreignKey: "postId",
    sourceKey: "postId",
  });
  Post.hasMany(Bookmark, { //완
    foreignKey: "postId",
    sourceKey: "postId",
  });
  Post.hasMany(Comment, { //완
    foreignKey: "postId",
    sourceKey: "postId",
  }); 
  Post.hasMany(ChildComment, { //완
    foreignKey: "postId",
    sourceKey: "postId",
  });
  Post.hasMany(CommentLike, { //완
    foreignKey: "postId",
    sourceKey: "postId",
  });

  // Like table 관계 설정
  Like.belongsTo(Post, { //완
    foreignKey: "postId",
    targetKey: "postId",
    onDelete: "cascade",
  });
  Like.belongsTo(User, { //완
    foreignKey: "userId",
    targetKey: "userId",
    onDelete: "cascade",
  });

  // commentLike table 관계 설정
  CommentLike.belongsTo(User, { //완
    foreignKey: "userId",
    targetKey: "userId",
    onDelete: "cascade",
  });
  CommentLike.belongsTo(Comment, { //완
    foreignKey: "commentId",
    targetKey: "commentId",
    onDelete: "cascade",
  });
  CommentLike.belongsTo(Post, { //완
    foreignKey: "postId",
    targetKey: "postId",
    onDelete: "cascade",
  });

// comment table 관계 설정
Comment.hasMany(ChildComment, { //완
  foreignKey: "commentId",
  sourceKey: "commentId",
});
Comment.hasMany(CommentLike, { //완
  foreignKey: "commentId",
  sourceKey: "commentId",
});
Comment.hasMany(ChildComment, { //완
  foreignKey: "commentId",
  sourceKey: "commentId",
});
Comment.belongsTo(User, { //완
  foreignKey: "userId",
  targetKey: "userId",
  onDelete: "cascade",
});
Comment.belongsTo(Post, { //완
  foreignKey: "postId",
  targetKey: "postId",
  onDelete: "cascade",
});

// childComment table 관계 설정
ChildComment.belongsTo(User, { //완
  foreignKey: "userId",
  targetKey: "userId",
  onDelete: "cascade",
});
ChildComment.belongsTo(Comment, { //완
  foreignKey: "commentId",
  targetKey: "commentId",
  onDelete: "cascade",
});
ChildComment.belongsTo(Post, { //완
  foreignKey: "postId",
  targetKey: "postId",
  onDelete: "cascade",
});

// bookmark table 관계 설정
Bookmark.belongsTo(Post, { //완
  foreignKey: "postId",
  targetKey: "postId",
  onDelete: "cascade",
});
Bookmark.belongsTo(User, { //완
  foreignKey: "userId",
  targetKey: "userId",
  onDelete: "cascade",
});
