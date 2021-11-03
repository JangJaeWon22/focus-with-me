const express = require("express");
const postsRouter = express.Router();
const {
  getOnePost,
  getPosts,
  postPosts,
  putPosts,
  deletePosts,
} = require("../controllers/postsController");
const { uploadCover } = require("../middlewares/upload");
const { filter, main } = require("../middlewares/filter");
const authMiddleware = require("../middlewares/auth");

/* GET users listing. */
postsRouter
  .route("/posts")
  .get(main, filter, getPosts)
  .post(uploadCover.single("imageCover"), postPosts);
postsRouter
  .route("/posts/:postId")
  .put(uploadCover.single("cover"), putPosts)
  .delete(deletePosts)
  .get(getOnePost);

module.exports = postsRouter;
