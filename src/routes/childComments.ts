import * as express from "express";
import { logInOnly, logInBoth } from "../middlewares/passport-auth";
import ChildCommentsController from "../controllers/childCommentController";
const { getChildComments, postChildComments, deleteChildComments } =
  ChildCommentsController;
const childCommentRouter = express.Router();

childCommentRouter
  .route("/posts/:postId/comments/:commentId/childs")
  .get(logInBoth, getChildComments)
  .post(logInOnly, postChildComments);

childCommentRouter
  .route("/posts/:postId/comments/:commentId/childs/:childCommentId")
  .delete(logInOnly, deleteChildComments);

module.exports = childCommentRouter;
