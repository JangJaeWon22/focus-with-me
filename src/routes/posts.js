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
  .put(authMiddleware, uploadCover.single("imageCover"), putPosts)
  .delete(authMiddleware, deletePosts)
<<<<<<< HEAD
  .get(authMiddleware, getOnePost);
=======
  .get(notAuth, getOnePost);
>>>>>>> a9433ab1fe7170d3a61b05294a329c52ad2f4982

module.exports = postsRouter;
