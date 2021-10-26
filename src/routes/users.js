const express = require("express");
const router = express.Router();
const userCtrl = require("../controllers/users-ctrl/users-ctrl");
router.post("/users/signup", userCtrl.userProcess.createUser);
const { userProcess } = require("../controllers/users-ctrl/userProcess");
const { userOutPut } = require("../controllers/users-ctrl/userOutPut");

//회원가입
router.post("/users/signup", userProcess.createUser);
router.post("/users/login", userOutPut.getUser);


module.exports = router;
