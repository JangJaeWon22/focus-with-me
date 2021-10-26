const express = require("express");
const postsRouter = express.Router();
const {
  getPosts,
  postPosts,
  putPosts,
  deletePosts,
} = require("../controller/postsController");

/* GET users listing. */
postsRouter.route("/").get(getPosts).post(postPosts);
postsRouter.route("/:postId").put(putPosts).delete(deletePosts);

module.exports = postsRouter;
