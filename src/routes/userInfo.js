const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/auth");
const {
  userInfoOutPut,
} = require("../controllers/userInfo-ctrl/userInfoOutPut");
const GetUserInfo = require("../middlewares/userInfo/userInfo");
const followMW = require("../middlewares/userInfo/userFollow");

// 회원 정보 페이지 - 회원정보조회 -- 메인 셋팅
router.get(
  "/mypage/myInfo/:userId",
  authMiddleware,
  followMW,
  GetUserInfo,
  userInfoOutPut.getUser
);

// 회원 정보 페이지 - 작성한 포스트 조회
router.get(
  "/mypage/myposts/:userId",
  authMiddleware,
  userInfoOutPut.getUserPost
);

// 회웢 정보 페이지 - 북마크한 포스트 조회
router.get(
  "/mypage/mybookmarks/:userId",
  authMiddleware,
  userInfoOutPut.getUserBookmark
);

module.exports = router;
