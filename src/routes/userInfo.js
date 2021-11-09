const express = require("express");
const router = express.Router();
const {
  userInfoOutPut,
} = require("../controllers/userInfo-ctrl/userInfoOutPut");
const GetUserInfo = require("../middlewares/userInfo/userInfo");
const followMW = require("../middlewares/userInfo/userFollow");
const { logInBoth } = require("../middlewares/passport-auth");

// 회원 정보 페이지 - 회원정보조회 -- 메인 셋팅
router.get(
  "/mypage/myInfo/:userId",
  logInBoth,
  followMW,
  GetUserInfo,
  userInfoOutPut.getUser
);

// 회원 정보 페이지 - 작성한 포스트 조회
router.get("/mypage/myposts/:userId", logInBoth, userInfoOutPut.getUserPost);

// 회원 정보 페이지 - 북마크한 포스트 조회
router.get(
  "/mypage/mybookmarks/:userId",
  logInBoth,
  userInfoOutPut.getUserBookmark
);

module.exports = router;
