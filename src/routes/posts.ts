// const express = require("express");
import * as express from "express";
import PostsController from "../controllers/postsController";
import uploadMiddlewares from "../middlewares/upload";
import filter from "../middlewares/filter";
import { logInOnly, logInBoth } from "../middlewares/passport-auth";

const {
  getOnePost,
  getPosts,
  postPosts,
  putPosts,
  deletePosts,
  ckUpload,
  getCoverOriginal,
} = PostsController;
// const { uploadTempS3, uploadCoverS3 } = uploadMiddlewares;

const postsRouter = express.Router();

postsRouter
  .route("/posts")
  .get(logInBoth, filter, getPosts)
  .post(
    logInOnly,
    uploadMiddlewares.uploadCoverS3.fields([
      { name: "coverOriginal", maxCount: 1 },
      { name: "coverCropped", maxCount: 1 },
    ]),
    postPosts
  );

// ckEditor5 custom image upload adapter
postsRouter
  .route("/posts/ckUpload")
  .post(logInOnly, uploadMiddlewares.uploadTempS3.single("temp"), ckUpload);

postsRouter
  .route("/posts/:postId")
  .put(
    logInOnly,
    uploadMiddlewares.uploadCoverS3.fields([
      { name: "coverOriginal", maxCount: 1 },
      { name: "coverCropped", maxCount: 1 },
    ]),
    putPosts
  )
  .delete(logInOnly, deletePosts)
  .get(logInBoth, getOnePost);

postsRouter
  .route("/posts/:postId/coverOriginal")
  .get(logInOnly, getCoverOriginal);

export default postsRouter;
// module.exports = postsRouter;
