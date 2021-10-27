const express = require("express");
const router = express.Router();
const { userProcess } = require("../controllers/users-ctrl/userProcess");
const { userOutPut } = require("../controllers/users-ctrl/userOutPut");
const { userExist } = require("../controllers/users-ctrl/userExist");
const authMW = require("../middlewares/auth");

//회원가입
router.post("/users/signup", userProcess.createUser);
//로그인
router.post("/users/login", userOutPut.getUser);
//회원탈퇴
router.delete("/users/withdrawal", authMW, userProcess.deleteUser);
//중복확인 - email
router.post("/users/emailexist", userExist.emailExist);
//중복확인 - nickname
router.post("/users/nicknameexist", userExist.nicknameExist);

module.exports = router;
