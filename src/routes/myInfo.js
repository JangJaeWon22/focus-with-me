const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/auth");
const { myInfoOutPut } = require("../controllers/myInfo-ctrl/myInfoOutPut");
const GetMyInfo = require("../middlewares/myInfo");
const followMW = require("../middlewares/follow");

// 회원정보조회 -- 메인 셋팅
router.get(
  "/mypage/myInfo",
  authMiddleware,
  followMW,
  GetMyInfo,
  myInfoOutPut.getUser
);

router.get("/mypage/myposts", authMiddleware, myInfoOutPut.getMyPost);

router.get("/mypage/mybookmarks", authMiddleware, myInfoOutPut.getMyBookmark);

module.exports = router;
