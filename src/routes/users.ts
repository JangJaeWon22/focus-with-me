import * as express from "express"
const router = express.Router();
import UserProcess from "../controllers/users-ctrl/userProcess"
import UserOutPut from "../controllers/users-ctrl/userOutPut"
import UserExist from "../controllers/users-ctrl/userExist"
import UserUpdate from "../controllers/users-ctrl/userUpdate"
import UploadAvatarS3 from "../middlewares/upload"
import VerifyJoi from "../middlewares/verifyJoi"
import * as passport from "passport"
// 수정해야됨 auth
const {
  logInOnly,
  logInNot,
  logInBoth,
} = require("../middlewares/passport-auth");

// 회원가입
router.post(
  "/users/signup",
  logInNot,
  VerifyJoi.signUpUser,
  UserProcess.createUser
);

// 중복확인 - email
router.post(
  "/users/emailexist",
  logInNot,
  VerifyJoi.existEmail,
  UserExist.existEmail
);

// 중복확인 - nickname
router.post(
  "/users/nicknameexist",
  logInBoth,
  VerifyJoi.existNickname,
  UserExist.existNickname
);

// 로그인
router.post("/users/login", logInNot, UserOutPut.authUser);

// 카카오 로그인 기능
router.get("/kakao", logInNot, passport.authenticate("kakao"));

// 카카오 로그인 콜백(카카오에서 콜백 받는 동시에, 프론트와 통신)
router.get(
  "/kakao/callback", // code = "sdafasdf" 받음
  logInNot,
  passport.authenticate("kakao"),
  UserOutPut.kakaoCallback
);

// 회원 정보 수정 => 프로필 사진, 닉네임
router.put(
  "/users/profileEdit",
  logInOnly,
  UploadAvatarS3.single("file"),
  VerifyJoi.updateUserProfile,
  UserUpdate.updateUserProfile
);

// 회원 정보 수정 => 비밀번호
router.put(
  "/users/edit",
  logInOnly,
  VerifyJoi.updateUserPw,
  UserUpdate.updateUserPw
);

// 회원탈퇴 
router.delete("/users/withdrawal", logInOnly, UserProcess.deleteUser);

export default router;
