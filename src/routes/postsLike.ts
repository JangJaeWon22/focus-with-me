// express 는 함수나 객체 또는 변수가 할당된 모듈이다
// require() 는 JS 라이브러리/파일이다
import * as express from "express";
// router를 세팅 하기 위해 필요하다
const router = express.Router();
// 게시물 좋아요 기능을 위해 컨트롤러를 적용했다
import postLikeController from "../controllers/likes-ctrl/postsLikeControl";
// 로그인한 상태에서만 사용할 수 있는 기능이다
import { logInOnly } from "../middlewares/passport-auth";


// 게시물 좋아요 추가
router.post("/posts/:postId/like", logInOnly, postLikeController.addLike);
// 게시물 좋아요 취소
router.delete("/posts/:postId/like",logInOnly,postLikeController.removeLike);

export default router;
