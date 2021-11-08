const express = require("express");
const postsRouter = express.Router();
const {
  getOnePost,
  getPosts,
  postPosts,
  putPosts,
  deletePosts,
  ckUpload,
} = require("../controllers/postsController");
const { uploadCover, uploadTemp } = require("../middlewares/upload");
const { filter, main } = require("../middlewares/filter");
const authMiddleware = require("../middlewares/auth");
const notAuth = require("../middlewares/notAuth");
const followingPostMW = require("../middlewares/followingPost");
const passport = require("passport");
const { isLoggedIn, existLoggedIn } = require("../middlewares/passport-auth");

/* GET users listing. */
postsRouter
  .route("/posts")
  .get(notAuth, main, filter, followingPostMW, getPosts)
  .post(authMiddleware, uploadCover.single("imageCover"), postPosts);

postsRouter
  .route("/posts/ckUpload")
  .post(authMiddleware, uploadTemp.single("temp"), ckUpload);

postsRouter
  .route("/posts/:postId")
  .put(authMiddleware, uploadCover.single("imageCover"), putPosts)
  .delete(authMiddleware, deletePosts)
  // .get(passport.authenticate("jwt", { session: false }), getOnePost);
  .get(isLoggedIn, getOnePost);

module.exports = postsRouter;
