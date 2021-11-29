"use strict";
exports.__esModule = true;
var express = require("express");
var router = express.Router();
var userProcess_1 = require("../controllers/users-ctrl/userProcess");
var userOutPut_1 = require("../controllers/users-ctrl/userOutPut");
var userExist_1 = require("../controllers/users-ctrl/userExist");
var userUpdate_1 = require("../controllers/users-ctrl/userUpdate");
var upload_1 = require("../middlewares/upload");
var verifyJoi_1 = require("../middlewares/verifyJoi");
var passport_1 = require("passport");
// 수정해야됨 auth
var passport_auth_1 = require("../middlewares/passport-auth");
// 회원가입
router.post("/users/signup", passport_auth_1.logInNot, verifyJoi_1["default"].signUpUser, userProcess_1["default"].createUser);
// 중복확인 - email
router.post("/users/emailexist", passport_auth_1.logInNot, verifyJoi_1["default"].existEmail, userExist_1["default"].existEmail);
// 중복확인 - nickname
router.post("/users/nicknameexist", passport_auth_1.logInBoth, verifyJoi_1["default"].existNickname, userExist_1["default"].existNickname);
// 로그인
router.post("/users/login", passport_auth_1.logInNot, userOutPut_1["default"].authUser);
// 카카오 로그인 기능
router.get("/kakao", passport_auth_1.logInNot, passport_1["default"].authenticate("kakao"));
// 카카오 로그인 콜백(카카오에서 콜백 받는 동시에, 프론트와 통신)
router.get("/kakao/callback", // code = "sdafasdf" 받음
passport_auth_1.logInNot, passport_1["default"].authenticate("kakao"), userOutPut_1["default"].kakaoCallback);
// 회원 정보 수정 => 프로필 사진, 닉네임
router.put("/users/profileEdit", passport_auth_1.logInOnly, upload_1["default"].uploadAvatarS3.single("file"), verifyJoi_1["default"].updateUserProfile, userUpdate_1["default"].updateUserProfile);
// 회원 정보 수정 => 비밀번호
router.put("/users/edit", passport_auth_1.logInOnly, verifyJoi_1["default"].updateUserPw, userUpdate_1["default"].updateUserPw);
// 회원탈퇴
router["delete"]("/users/withdrawal", passport_auth_1.logInOnly, userProcess_1["default"].deleteUser);
exports["default"] = router;
