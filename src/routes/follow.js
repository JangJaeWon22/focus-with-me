const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/auth");
const { followProcess } = require("../controllers/follow-ctrl/followProcess");
const { followOutPut } = require("../controllers/follow-ctrl/followOutPut");
const followMW = require("../middlewares/follow");

//팔로우 추가
router.post("/follows", authMiddleware, followProcess.createFollow);

//팔로우 취소
router.delete("/follows", authMiddleware, followProcess.deleteFollow);

// 팔로윙 중인 계정 보기
router.get("/followings", authMiddleware, followOutPut.getFollowing);

// 나를 팔로워하는 계정 보기
router.get("/followers", authMiddleware, followOutPut.getFollower);

module.exports = router;
