"use strict";
exports.__esModule = true;
var express = require("express");
var router = express.Router();
var userInfoOutPut_1 = require("../controllers/userInfoOutPut");
var userInfo_1 = require("../middlewares/userInfo/userInfo");
var userFollow_1 = require("../middlewares/userInfo/userFollow");
var passport_auth_1 = require("../middlewares/passport-auth");
// 회원 정보 페이지 - 회원정보조회 -- 메인 셋팅
router.get("/mypage/myInfo/:userId", passport_auth_1.logInBoth, userFollow_1["default"].follow, userInfo_1["default"].getUserInfo, userInfoOutPut_1["default"].getUser);
// 회원 정보 페이지 - 작성한 포스트 조회
router.get("/mypage/myposts/:userId", passport_auth_1.logInBoth, userInfoOutPut_1["default"].getUserPost);
// 회원 정보 페이지 - 북마크한 포스트 조회
router.get("/mypage/mybookmarks/:userId", passport_auth_1.logInBoth, userInfoOutPut_1["default"].getUserBookmark);
exports["default"] = router;
