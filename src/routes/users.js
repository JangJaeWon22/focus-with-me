const express = require("express");
const router = express.Router();
const { userProcess } = require("../controllers/users-ctrl/userProcess");
const { userOutPut } = require("../controllers/users-ctrl/userOutPut");
const { userExist } = require("../controllers/users-ctrl/userExist");
const { userUpdate } = require("../controllers/users-ctrl/userUpdate");
const authMW = require("../middlewares/auth");
const { uploadAvatar } = require("../middlewares/upload");
const { verifyJoi } = require("../middlewares/verifyJoi");
const passport = require("passport");

//회원가입
router.post("/users/signup", verifyJoi.singUpUser, userProcess.createUser);
//로그인
router.post("/users/login", userOutPut.authUser);
//회원탈퇴
router.delete("/users/withdrawal", authMW, userProcess.deleteUser);
//중복확인 - email
router.post("/users/emailexist", userExist.existEmail);
//중복확인 - nickname
router.post("/users/nicknameexist", userExist.existNickname);

router.get("/kakao", passport.authenticate("kakao"));
router.get(
  "/kakao/callback",
  passport.authenticate("kakao", {
    failureRedirect: "/",
  }),
  (req, res) => {
    res.status(201).send({ message: "로그인에 성공하셨습니다." });
  }
);

router.put(
  "/users/edit",
  authMW,
  uploadAvatar.single("file"),
  verifyJoi.updateUser,
  userUpdate.updateUser
);

module.exports = router;
