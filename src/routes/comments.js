const express = require("express");
const router = express.Router();
const { Comment } = require("../models/comment");
//add middleware function
//add controller function
//const auth = require("../controller/comments/cmt-ctrl");

/* comments listing. */
//댓글 생성
router.post("/posts/:postId/comments");
//댓글 조회
router.get("/posts/:postId/comments");
//댓글 삭제
router.delete("/posts/:postId/comments/:commentId");

module.exports = router;
