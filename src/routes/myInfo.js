const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/auth");
const { myInfoOutPut } = require("../controllers/myInfo-ctrl/myInfoOutPut");
const GetMyInfo = require("../middlewares/myInfo");

// 회원정보조회 -- 메인 셋팅
router.get("/mypage/myInfo", authMiddleware, GetMyInfo, myInfoOutPut.getUser);

router.get(
  "/mypage/myposts",
  authMiddleware,
  GetMyInfo,
  myInfoOutPut.getMyPost
);

module.exports = router;
