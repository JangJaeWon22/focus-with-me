const express = require("express");
const router = express.Router();

// add controller function
const cmtCtrl = require("../controllers/comments-ctrl/cmtsControl");
// add middleware function
const authMiddleware = require("../middlewares/auth");

/* comments functions */
// 댓글 생성
router.post(
  "/posts/:postId/comments",
  authMiddleware,
  cmtCtrl.comments.commentUser
);
// 댓글 조회
router.get("/posts/:postId/comments", cmtCtrl.comments.commentSearch);

// 댓글 삭제
router.delete(
  "/posts/:postId/comments/:commentId",
  authMiddleware,
  cmtCtrl.comments.commentDel
);

module.exports = router;
