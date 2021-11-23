const express = require("express");
const { logInOnly, logInBoth } = require("../middlewares/passport-auth");
const {
  getChildComments,
  postChildComments,
  deleteChildComments,
} = require("../controllers/childCommentController");
const childCommentRouter = express.Router();

childCommentRouter
  .route("/api/posts/:postId/comments/:commentId/childs")
  .get(logInBoth, getChildComments)
  .post(logInOnly, postChildComments);

childCommentRouter
  .route("/api/posts/:postId/comments/:commentId/childs/:childCommentId")
  .delete(logInOnly, deleteChildComments);
