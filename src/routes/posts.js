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
const followingPostMW = require("../middlewares/followingPost");
const { logInOnly, logInBoth } = require("../middlewares/passport-auth");

/* GET users listing. */
postsRouter
  .route("/posts")
  .get(logInBoth, main, filter, followingPostMW, getPosts)
  .post(logInOnly, uploadCover.single("imageCover"), postPosts);

postsRouter
  .route("/posts/ckUpload")
  .post(logInOnly, uploadTemp.single("temp"), ckUpload);

postsRouter
  .route("/posts/:postId")
  .put(logInOnly, uploadCover.single("imageCover"), putPosts)
  .delete(logInOnly, deletePosts)
  .get(logInOnly, getOnePost);

module.exports = postsRouter;
