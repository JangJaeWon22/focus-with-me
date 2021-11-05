const express = require("express");
const router = express.Router();

//add controller function 
const cmtdetailCtrl = require("../controllers/comments-ctrl/cmtsPlus-Ctrl");

/* comments listing. */
//댓글 좋아요 추가
router.post("/posts/:postId/comments", cmtdetailCtrl.comments.commentLikeAdd);
//댓글 좋아요 취소
router.get("/posts/:postId/comments", cmtdetailCtrl.comments.commentLikeSub);

module.exports = router;
