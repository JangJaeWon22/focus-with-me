import * as express from "express"
const router = express.Router();
import UserInfoOutPut from "../controllers/userInfoOutPut"
import UserInfo from "../middlewares/userInfo/userInfo"
import FollowMw from "../middlewares/userInfo/userFollow"
import { logInBoth } from "../middlewares/passport-auth";

// 회원 정보 페이지 - 회원정보조회 -- 메인 셋팅
router.get(
  "/mypage/myInfo/:userId",
  logInBoth,
  FollowMw.follow,
  UserInfo.getUserInfo,
  UserInfoOutPut.getUser
);

// 회원 정보 페이지 - 작성한 포스트 조회
router.get("/mypage/myposts/:userId", logInBoth, UserInfoOutPut.getUserPost);

// 회원 정보 페이지 - 북마크한 포스트 조회
router.get(
  "/mypage/mybookmarks/:userId",
  logInBoth,
  UserInfoOutPut.getUserBookmark
);

module.exports = router;
