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
const {
  uploadAvatarS3,
  uploadTempS3,
  uploadCoverS3,
} = require("../middlewares/upload");

const { filter } = require("../middlewares/filter");
const { logInOnly, logInBoth } = require("../middlewares/passport-auth");

/* GET users listing. */
// postsRouter
//   .route("/posts")
//   .get(logInBoth, filter, getPosts)
//   .post(logInOnly, uploadCover.single("imageCover"), postPosts);

// ckEditor5 custom image upload adapter
// postsRouter
//   .route("/posts/ckUpload")
//   .post(logInOnly, uploadTemp.single("temp"), ckUpload);

postsRouter
  .route("/posts")
  .get(logInBoth, filter, getPosts)
  .post(logInOnly, uploadCoverS3.single("imageCover"), postPosts);

// ckEditor5 custom image upload adapter
postsRouter
  .route("/posts/ckUpload")
  .post(logInOnly, uploadTempS3.single("temp"), ckUpload);

postsRouter
  .route("/posts/:postId")
  .put(logInOnly, uploadCoverS3.single("imageCover"), putPosts)
  .delete(logInOnly, deletePosts)
  .get(logInBoth, getOnePost);

module.exports = postsRouter;
