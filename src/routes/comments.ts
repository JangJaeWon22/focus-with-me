// express 는 함수나 객체 또는 변수가 할당된 모듈이다
// require() 는 JS 라이브러리/파일이다
import * as express from "express";
// router를 세팅 하기 위해 필요하다
const router = express.Router();

// 댓글 기능을 위해 컨트롤러를 적용했다
import cmtCtrl from "../controllers/comments-ctrl/cmtsControl";
// 로그인 했을 때와 안 했을 때 모두 적용된 미들웨어다
import { logInOnly, logInBoth } from "../middlewares/passport-auth";


// 댓글 생성 라우터
router.post("/posts/:postId/comments", logInOnly, cmtCtrl.commentCreate);
// 댓글 조회 라우터
router.get("/posts/:postId/comments", logInBoth, cmtCtrl.commentSearch);

// 댓글 삭제 라우터
// 해당 게시물에 대한 특정한 댓글을 식별해주기 위해서, :commentId 라는 유니크한 값을 붙여줌 
// 로그인이 된 상태에서만 해당 기능이 작동하기 위해서 logInOnly 미들웨어를 사용함
// 댓글 삭제
router.delete("/posts/:postId/comments/:commentId", logInOnly, cmtCtrl.commentDel);

export default router;
