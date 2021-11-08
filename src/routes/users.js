const express = require("express");
const router = express.Router();
const { userProcess } = require("../controllers/users-ctrl/userProcess");
const { userOutPut } = require("../controllers/users-ctrl/userOutPut");
const { userExist } = require("../controllers/users-ctrl/userExist");
const { userUpdate } = require("../controllers/users-ctrl/userUpdate");
const { uploadAvatar } = require("../middlewares/upload");
const { verifyJoi } = require("../middlewares/verifyJoi");
const authMiddleware = require("../middlewares/auth");
const passport = require("passport");

// 회원가입
router.post("/users/signup", verifyJoi.singUpUser, userProcess.createUser);

// 중복확인 - email
router.post("/users/emailexist", userExist.existEmail);

// 중복확인 - nickname
router.post("/users/nicknameexist", userExist.existNickname);

// 로그인
router.post("/users/login", userOutPut.authUser);

// router.post(
//   "/users/auth",
//   passport.authenticate("local"),
//   // passport.authenticate("jwt", { session: false }),
//   async (req, res, next) => {
//     try {
//       const user = req.user;
//       const aaa = "12312312";
//       res.json({ aaa, user, result: true });
//     } catch (error) {
//       console.error(error);
//       next(error);
//     }
//   }
// );

// 카카오 로그인 기능
router.get("/kakao", passport.authenticate("kakao"));

// 카카오 로그인 콜백(카카오에서 콜백 받는 동시에, 프론트와 통신)
router.get(
  "/kakao/callback", // code = "sdafasdf" 받음
  passport.authenticate("kakao"),
  userOutPut.kakaoCallback
);

// 회원 정보 수정 => 프로필 사진, 닉네임
router.put(
  "/users/profileEdit",
  authMiddleware,
  uploadAvatar.single("file"),
  verifyJoi.updateUserProfile,
  userUpdate.updateUserProfile
);

// 회원 정보 수정 => 비밀번호
router.put(
  "/users/edit",
  authMiddleware,
  verifyJoi.updateUserPw,
  userUpdate.updateUserPw
);

// 회원탈퇴
router.delete("/users/withdrawal", authMiddleware, userProcess.deleteUser);

module.exports = router;
