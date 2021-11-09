const express = require("express");
const router = express.Router();
const { followProcess } = require("../controllers/follow-ctrl/followProcess");
const { followOutPut } = require("../controllers/follow-ctrl/followOutPut");
const { logInOnly } = require("../middlewares/passport-auth");
const followMw = require("../middlewares/userInfo/userFollow");

//팔로우 추가
router.post("/follows", logInOnly, followProcess.createFollow);

//팔로우 취소
router.delete("/follows", logInOnly, followProcess.deleteFollow);

// user가 팔로윙 중인 계정 보기
router.get(
  "/followings/:userId",
  logInOnly,
  followMw,
  followOutPut.getFollowing
);

// user가 팔로워하는 계정 보기
router.get("/followers/:userId", logInOnly, followMw, followOutPut.getFollower);

module.exports = router;
