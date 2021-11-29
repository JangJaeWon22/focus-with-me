import * as express from "express"
const router = express.Router();
import FollowProcess from "../controllers/follow-ctrl/followProcess"
import FollowOutPut from "../controllers/follow-ctrl/followOutPut"
import { logInOnly } from "../middlewares/passport-auth";
import FollowMW from "../middlewares/userInfo/userFollow"


//팔로우 추가
router.post("/follows", logInOnly, FollowProcess.createFollow);

//팔로우 취소
router.delete("/follows", logInOnly, FollowProcess.deleteFollow);

// user가 팔로윙 중인 계정 보기
router.get(
  "/followings/:userId",
  logInOnly,
  FollowMW.follow,
  FollowOutPut.getFollowing
);

// user가 팔로워하는 계정 보기
router.get("/followers/:userId", logInOnly, FollowMW.follow, FollowOutPut.getFollower);

export default router;
