"use strict";
exports.__esModule = true;
var express = require("express");
var router = express.Router();
var followProcess_1 = require("../controllers/follow-ctrl/followProcess");
var followOutPut_1 = require("../controllers/follow-ctrl/followOutPut");
var passport_auth_1 = require("../middlewares/passport-auth");
var userFollow_1 = require("../middlewares/userInfo/userFollow");
//팔로우 추가
router.post("/follows", passport_auth_1.logInOnly, followProcess_1["default"].createFollow);
//팔로우 취소
router["delete"]("/follows", passport_auth_1.logInOnly, followProcess_1["default"].deleteFollow);
// user가 팔로윙 중인 계정 보기
router.get("/followings/:userId", passport_auth_1.logInOnly, userFollow_1["default"].follow, followOutPut_1["default"].getFollowing);
// user가 팔로워하는 계정 보기
router.get("/followers/:userId", passport_auth_1.logInOnly, userFollow_1["default"].follow, followOutPut_1["default"].getFollower);
exports["default"] = router;
