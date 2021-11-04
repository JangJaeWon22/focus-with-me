const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/auth");
const { followProcess } = require("../controllers/follow-ctrl/followProcess");

//팔로우 추가
router.post("/follows", authMiddleware, followProcess.createFollow);

//팔로우 취소
router.delete("/follows", authMiddleware, followProcess.deleteFollow);

module.exports = router;
