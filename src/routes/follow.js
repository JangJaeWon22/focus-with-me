const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/auth");
const { followProcess } = require("../controllers/follow-ctrl/followProcess");
const { followOutPut } = require("../controllers/follow-ctrl/followOutPut");
const followMw = require("../middlewares/userInfo/userFollow");

//팔로우 추가
router.post("/follows", authMiddleware, followProcess.createFollow);

//팔로우 취소
router.delete("/follows", authMiddleware, followProcess.deleteFollow);

// user가 팔로윙 중인 계정 보기
router.get(
  "/followings/:userId",
  authMiddleware,
  followMw,
  followOutPut.getFollowing
);

// user가 팔로워하는 계정 보기
router.get(
  "/followers/:userId",
  authMiddleware,
  followMw,
  followOutPut.getFollower
);

module.exports = router;
