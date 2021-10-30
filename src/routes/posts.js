const express = require("express");
const postsRouter = express.Router();
const {
  getPosts,
  postPosts,
  putPosts,
  deletePosts,
} = require("../controllers/postsController");
const { uploadCover } = require("../middlewares/upload");
const { filter, main } = require("../middlewares/filter");

/* GET users listing. */
postsRouter
  .route("/posts")
  .get(main, filter, getPosts)
  .post(uploadCover.single("imageCover"), postPosts);
postsRouter
  .route("/posts/:postId")
  .put(uploadCover.single("cover"), putPosts)
  .delete(deletePosts);

module.exports = postsRouter;
