const express = require("express");
const router = express.Router();

// add controller function
const cmtCtrl = require("../controllers/comments-ctrl/cmtsControl");
// add middleware function
const { logInOnly, logInBoth } = require("../middlewares/passport-auth");


// 댓글 생성 라우터
router.post("/posts/:postId/comments", logInOnly, cmtCtrl.comments.commentCreate);
// 댓글 조회 라우터
router.get(
  "/posts/:postId/comments",
  logInBoth,
  cmtCtrl.comments.commentSearch
);

// 댓글 삭제 라우터
router.delete(
  // 해당 게시물에 대한 특정한 댓글을 식별해주기 위해서, :commentId 라는 유니크한 값을 붙여줌 
  "/posts/:postId/comments/:commentId",
  // 로그인이 된 상태에서만 해당 기능이 작동하기 위해서 logInOnly 미들웨어를 사용함
  logInOnly,
  // 댓글 삭제
  cmtCtrl.comments.commentDel
);

module.exports = router;
