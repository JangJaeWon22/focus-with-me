"use strict";
exports.__esModule = true;
// const express = require("express");
var express = require("express");
var postsController_1 = require("../controllers/postsController");
var upload_1 = require("../middlewares/upload");
var filter_1 = require("../middlewares/filter");
var passport_auth_1 = require("../middlewares/passport-auth");
var getOnePost = postsController_1["default"].getOnePost, getPosts = postsController_1["default"].getPosts, postPosts = postsController_1["default"].postPosts, putPosts = postsController_1["default"].putPosts, deletePosts = postsController_1["default"].deletePosts, ckUpload = postsController_1["default"].ckUpload, getCoverOriginal = postsController_1["default"].getCoverOriginal;
var uploadTempS3 = upload_1["default"].uploadTempS3, uploadCoverS3 = upload_1["default"].uploadCoverS3;
var postsRouter = express.Router();
postsRouter
    .route("/posts")
    .get(passport_auth_1.logInBoth, filter_1["default"], getPosts)
    .post(passport_auth_1.logInOnly, uploadCoverS3.fields([
    { name: "coverOriginal", maxCount: 1 },
    { name: "coverCropped", maxCount: 1 },
]), postPosts);
// ckEditor5 custom image upload adapter
postsRouter
    .route("/posts/ckUpload")
    .post(passport_auth_1.logInOnly, uploadTempS3.single("temp"), ckUpload);
postsRouter
    .route("/posts/:postId")
    .put(passport_auth_1.logInOnly, uploadCoverS3.fields([
    { name: "coverOriginal", maxCount: 1 },
    { name: "coverCropped", maxCount: 1 },
]), putPosts)["delete"](passport_auth_1.logInOnly, deletePosts)
    .get(passport_auth_1.logInBoth, getOnePost);
postsRouter
    .route("/posts/:postId/coverOriginal")
    .get(passport_auth_1.logInOnly, getCoverOriginal);
exports["default"] = postsRouter;
// module.exports = postsRouter;
