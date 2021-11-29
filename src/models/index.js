"use strict";
exports.__esModule = true;
exports.Bookmark = exports.ChildComment = exports.Comment = exports.CommentLike = exports.Like = exports.Post = exports.User = exports.sequelize = void 0;
var Sequelize = require("sequelize");
var config_1 = require("../config/config");
var user_1 = require("./user");
var post_1 = require("./post");
var like_1 = require("./like");
var commentLike_1 = require("./commentLike");
var comment_1 = require("./comment");
var childComment_1 = require("./childComment");
var bookmark_1 = require("./bookmark");
exports.sequelize = new Sequelize.Sequelize(config_1.config.rds.database, config_1.config.rds.username, config_1.config.rds.password, {
    host: config_1.config.rds.host,
    dialect: 'mysql'
});
exports.User = (0, user_1.UserFactory)(exports.sequelize);
exports.Post = (0, post_1.PostFactory)(exports.sequelize);
exports.Like = (0, like_1.LikeFactory)(exports.sequelize);
exports.CommentLike = (0, commentLike_1.CommentLikeFactory)(exports.sequelize);
exports.Comment = (0, comment_1.CommentFactory)(exports.sequelize);
exports.ChildComment = (0, childComment_1.ChildCommentFactory)(exports.sequelize);
exports.Bookmark = (0, bookmark_1.BookmarkFactory)(exports.sequelize);
// User table 관계 설정
exports.User.hasMany(exports.Post, {
    foreignKey: "userId",
    sourceKey: "userId"
});
exports.User.hasMany(exports.Comment, {
    foreignKey: "userId",
    sourceKey: "userId"
});
exports.User.hasMany(exports.ChildComment, {
    foreignKey: "userId",
    sourceKey: "userId"
});
exports.User.hasMany(exports.Like, {
    foreignKey: "userId",
    sourceKey: "userId"
});
exports.User.hasMany(exports.Bookmark, {
    foreignKey: "userId",
    sourceKey: "userId"
});
exports.User.hasMany(exports.CommentLike, {
    foreignKey: "userId",
    sourceKey: "userId"
});
exports.User.belongsToMany(exports.User, {
    foreignKey: "followingId",
    as: "Followers",
    through: "Follow",
    onDelete: "cascade"
});
exports.User.belongsToMany(exports.User, {
    foreignKey: "followerId",
    as: "Followings",
    through: "Follow",
    onDelete: "cascade"
});
//Post table 관계설정
exports.Post.belongsTo(exports.User, {
    foreignKey: "userId",
    targetKey: "userId",
    onDelete: "cascade"
});
exports.Post.hasMany(exports.Like, {
    foreignKey: "postId",
    sourceKey: "postId"
});
exports.Post.hasMany(exports.Bookmark, {
    foreignKey: "postId",
    sourceKey: "postId"
});
exports.Post.hasMany(exports.Comment, {
    foreignKey: "postId",
    sourceKey: "postId"
});
exports.Post.hasMany(exports.ChildComment, {
    foreignKey: "postId",
    sourceKey: "postId"
});
exports.Post.hasMany(exports.CommentLike, {
    foreignKey: "postId",
    sourceKey: "postId"
});
// Like table 관계 설정
exports.Like.belongsTo(exports.Post, {
    foreignKey: "postId",
    targetKey: "postId",
    onDelete: "cascade"
});
exports.Like.belongsTo(exports.User, {
    foreignKey: "userId",
    targetKey: "userId",
    onDelete: "cascade"
});
// commentLike table 관계 설정
exports.CommentLike.belongsTo(exports.User, {
    foreignKey: "userId",
    targetKey: "userId",
    onDelete: "cascade"
});
exports.CommentLike.belongsTo(exports.Comment, {
    foreignKey: "commentId",
    targetKey: "commentId",
    onDelete: "cascade"
});
exports.CommentLike.belongsTo(exports.Post, {
    foreignKey: "postId",
    targetKey: "postId",
    onDelete: "cascade"
});
// comment table 관계 설정
exports.Comment.hasMany(exports.ChildComment, {
    foreignKey: "commentId",
    sourceKey: "commentId"
});
exports.Comment.hasMany(exports.CommentLike, {
    foreignKey: "commentId",
    sourceKey: "commentId"
});
exports.Comment.hasMany(exports.ChildComment, {
    foreignKey: "commentId",
    sourceKey: "commentId"
});
exports.Comment.belongsTo(exports.User, {
    foreignKey: "userId",
    targetKey: "userId",
    onDelete: "cascade"
});
exports.Comment.belongsTo(exports.Post, {
    foreignKey: "postId",
    targetKey: "postId",
    onDelete: "cascade"
});
// childComment table 관계 설정
exports.ChildComment.belongsTo(exports.User, {
    foreignKey: "userId",
    targetKey: "userId",
    onDelete: "cascade"
});
exports.ChildComment.belongsTo(exports.Comment, {
    foreignKey: "commentId",
    targetKey: "commentId",
    onDelete: "cascade"
});
exports.ChildComment.belongsTo(exports.Post, {
    foreignKey: "postId",
    targetKey: "postId",
    onDelete: "cascade"
});
// bookmark table 관계 설정
exports.Bookmark.belongsTo(exports.Post, {
    foreignKey: "postId",
    targetKey: "postId",
    onDelete: "cascade"
});
exports.Bookmark.belongsTo(exports.User, {
    foreignKey: "userId",
    targetKey: "userId",
    onDelete: "cascade"
});
