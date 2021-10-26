const express = require("express");
const router = express.Router();
const { userProcess } = require("../controllers/users-ctrl/userProcess");
const { userOutPut } = require("../controllers/users-ctrl/userOutPut");

//회원가입
router.post("/users/signup", userProcess.createUser);

router.post("/users/login", userOutPut.getUser);

module.exports = router;
