// 댓글 좋아요 기능 구현

// Insert express
const express = require("express");
// Insert router
const router = express.Router();
// Insert controller function
const cmtslikeCtrl = require("../controllers/likes-ctrl/cmtslikeControl");
// Insert middleware function
const { logInOnly } = require("../middlewares/passport-auth");

/* comments like functions */
// Create the method of commentslike (function)

// 댓글 좋아요 추가
router.post(
  "/posts/:postId/comments/:commentId/like",
  logInOnly,
  cmtslikeCtrl.commentsLikeFunc.likeExist
);
// 댓글 좋아요 취소
router.delete(
  "/posts/:postId/comments/:commentId/like",
  logInOnly,
  cmtslikeCtrl.commentsLikeFunc.notLikeExist
);

module.exports = router;
