// express 는 함수나 객체 또는 변수가 할당된 모듈이다
// require() 는 JS 라이브러리/파일이다
const express = require("express");
// router를 세팅 하기 위해 필요하다
const router = express.Router();

// 댓글 기능을 위해 컨트롤러를 적용했다
const cmtCtrl = require("../controllers/comments-ctrl/cmtsControl");
// 로그인 했을 때와 안 했을 때 모두 적용된 미들웨어다
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

// 댓글 페이지 라우터
router.get(
  "/posts/:postId/comments/:page", 
  logInBoth, 
  cmtCtrl.comments.commentPg
);

module.exports = router;
