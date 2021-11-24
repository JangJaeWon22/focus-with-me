const express = require("express");
const childCommentRouter = express.Router();

const { logInOnly, logInBoth } = require("../middlewares/passport-auth");
const {
  getChildComments,
  postChildComments,
  deleteChildComments,
} = require("../controllers/childCommentController");

childCommentRouter
  .route("/posts/:postId/comments/:commentId/childs")
  .get(logInBoth, getChildComments)
  .post(logInOnly, postChildComments);

childCommentRouter
  .route("/posts/:postId/comments/:commentId/childs/:childCommentId")
  .delete(logInOnly, deleteChildComments);

module.exports = childCommentRouter;
