"use strict";
exports.__esModule = true;
// express 는 함수나 객체 또는 변수가 할당된 모듈이다
// require() 는 TS 라이브러리/파일이다
var express = require("express");
// router를 세팅 하기 위해 필요하다
var router = express.Router();
// 댓글 좋아요를 위해 컨트롤러를 적용했다
var cmtsLikeControl_1 = require("../controllers/likes-ctrl/cmtsLikeControl");
// 로그인 했을 때만 이용 가능한 미들웨어다
var passport_auth_1 = require("../middlewares/passport-auth");
// 댓글 좋아요 추가
router.post("/posts/:postId/comments/:commentId/like", passport_auth_1.logInOnly, cmtsLikeControl_1["default"].likeExist);
// 댓글 좋아요 취소
router["delete"]("/posts/:postId/comments/:commentId/like", passport_auth_1.logInOnly, cmtsLikeControl_1["default"].notLikeExist);
exports["default"] = router;
