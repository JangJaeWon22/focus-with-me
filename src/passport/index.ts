import passport from "passport";
import local from "./localStrategy";
import kakao from "./kakaoStrategy";
import { User } from "../models";
import { jwt } from "./jwt";

class Passport {
  public config = () => {
    console.log("passportconfig() 실행!");
    passport.serializeUser((user: any, done: any) => {
      console.log("kakaoStrategy.js에서 옴 ㅎㅇ");
      done(null, user.userId);
    });

    passport.deserializeUser((userId, done) => {
      console.log("ㅎㅇ User 정보 필요하구나? 도와드림 ㅎㅎ");
      User.findOne({
        where: { userId },
        include: [
          {
            model: User,
            attributes: ["userId", "nickname"],
            as: "Followers",
          },
          {
            model: User,
            attributes: ["userId", "nickname"],
            as: "Followings",
          },
        ],
      })
        .then((user) => done(null, user))
        .catch((error) => done(error));
    });

    local();
    kakao();
    jwt();
  };
}

export default Passport;
