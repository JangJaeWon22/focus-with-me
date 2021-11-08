const express = require("express");
const router = express.Router();
const { userProcess } = require("../controllers/users-ctrl/userProcess");
const { userOutPut } = require("../controllers/users-ctrl/userOutPut");
const { userExist } = require("../controllers/users-ctrl/userExist");
const { userUpdate } = require("../controllers/users-ctrl/userUpdate");
const { uploadAvatar } = require("../middlewares/upload");
const { verifyJoi } = require("../middlewares/verifyJoi");
const authMiddleware = require("../middlewares/auth");
const passport = require("passport");
const { logInOnly, logInNot } = require("../middlewares/passport-auth");

// 회원가입
router.post(
  "/users/signup",
  logInNot,
  verifyJoi.singUpUser,
  userProcess.createUser
);

// 중복확인 - email
router.post("/users/emailexist", logInNot, userExist.existEmail);

// 중복확인 - nickname
router.post("/users/nicknameexist", logInNot, userExist.existNickname);

// 로그인
router.post("/users/login", logInNot, userOutPut.authUser);

// 카카오 로그인 기능
router.get("/kakao", logInNot, passport.authenticate("kakao"));

// 카카오 로그인 콜백(카카오에서 콜백 받는 동시에, 프론트와 통신)
router.get(
  "/kakao/callback", // code = "sdafasdf" 받음
  logInNot,
  passport.authenticate("kakao"),
  userOutPut.kakaoCallback
);

// 회원 정보 수정 => 프로필 사진, 닉네임
router.put(
  "/users/profileEdit",
  logInOnly,
  uploadAvatar.single("file"),
  verifyJoi.updateUserProfile,
  userUpdate.updateUserProfile
);

// 회원 정보 수정 => 비밀번호
router.put(
  "/users/edit",
  logInOnly,
  verifyJoi.updateUserPw,
  userUpdate.updateUserPw
);

// 회원탈퇴
router.delete("/users/withdrawal", logInOnly, userProcess.deleteUser);

module.exports = router;
