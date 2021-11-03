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

/* GET users listing. */
postsRouter
  .route("/posts")
  .get(main, filter, getPosts)
  .post(authMiddleware, uploadCover.single("imageCover"), postPosts);

postsRouter
  .route("/posts/ckUpload")
  .post(authMiddleware, uploadTemp.single("temp"), ckUpload);

postsRouter
  .route("/posts/:postId")
  .put(authMiddleware, uploadCover.single("cover"), putPosts)
  .delete(authMiddleware, deletePosts)
  .get(getOnePost);

module.exports = postsRouter;
