const express = require("express");
const router = express.Router();
// add controller function
const postingLikeCtrl = require("../controllers/likes-ctrl/postsLikeClick");
// add middleware function
const authMiddleware = require("../middlewares/auth");

/* posts like functions */
// 게시물 좋아요 추가
router.post(
  "/posts/:postId/like",
  authMiddleware,
  postingLikeCtrl.postList.addLike
);
// 게시물 좋아요 취소
router.delete(
  "/posts/:postId/like",
  authMiddleware,
  postingLikeCtrl.postList.removeLike
);

module.exports = router;
