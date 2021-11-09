const express = require("express");
const router = express.Router();

// add controller function
const cmtCtrl = require("../controllers/comments-ctrl/cmtsControl");
// add middleware function
const { logInOnly, logInBoth } = require("../middlewares/passport-auth");

/* comments functions */
// 댓글 생성
router.post("/posts/:postId/comments", logInOnly, cmtCtrl.comments.commentUser);
// 댓글 조회
router.get(
  "/posts/:postId/comments",
  logInBoth,
  cmtCtrl.comments.commentSearch
);

// 댓글 삭제
router.delete(
  "/posts/:postId/comments/:commentId",
  logInOnly,
  cmtCtrl.comments.commentDel
);

module.exports = router;
