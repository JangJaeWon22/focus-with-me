"use strict";
exports.__esModule = true;
var express = require("express");
var passport_auth_1 = require("../middlewares/passport-auth");
var childCommentController_1 = require("../controllers/childCommentController");
var getChildComments = childCommentController_1["default"].getChildComments, postChildComments = childCommentController_1["default"].postChildComments, deleteChildComments = childCommentController_1["default"].deleteChildComments;
var childCommentRouter = express.Router();
childCommentRouter
    .route("/posts/:postId/comments/:commentId/childs")
    .get(passport_auth_1.logInBoth, getChildComments)
    .post(passport_auth_1.logInOnly, postChildComments);
childCommentRouter
    .route("/posts/:postId/comments/:commentId/childs/:childCommentId")["delete"](passport_auth_1.logInOnly, deleteChildComments);
exports["default"] = childCommentRouter;
// module.exports = childCommentRouter;
