const express = require("express");
const postsRouter = express.Router();
const {
  getPosts,
  postPosts,
  putPosts,
  deletePosts,
} = require("../controllers/postsController");
const { uploadCover } = require("../middlewares/uploadMiddleware");

/* GET users listing. */
postsRouter
  .route("/posts")
  .get(getPosts)
  .post(uploadCover.single("cover"), postPosts);
postsRouter.route("/posts/:postId").put(putPosts).delete(deletePosts);

module.exports = postsRouter;
