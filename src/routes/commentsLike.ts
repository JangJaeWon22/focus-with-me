// express 는 함수나 객체 또는 변수가 할당된 모듈이다
// require() 는 TS 라이브러리/파일이다
import * as express from "express";
// router를 세팅 하기 위해 필요하다
const router = express.Router();
// 댓글 좋아요를 위해 컨트롤러를 적용했다
import commentsLikeController from "../controllers/likes-ctrl/cmtsLikeControl";
// 로그인 했을 때만 이용 가능한 미들웨어다
import { logInOnly } from "../middlewares/passport-auth";
import { commentLikeFactory } from "../models/commentLike";

// 댓글 좋아요 추가
router.post("/posts/:postId/comments/:commentId/like", logInOnly, commentsLikeController.likeExist);
// 댓글 좋아요 취소
router.delete("/posts/:postId/comments/:commentId/like", logInOnly, commentsLikeController.notLikeExist);

export default commentLikeFactory;
