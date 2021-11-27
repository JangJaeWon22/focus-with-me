import * as passport from "passport"
import * as passportJwt from "passport-jwt"
const { ExtractJwt, Strategy: JWTStrategy } = passportJwt

import { User } from "../models"
import { user } from "../interfaces/user"

export interface jwtPayload{
  userId:number
}

const JWTConfig = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.TOKEN_KEY,
};

const JWTVerify = async (jwtPayload: jwtPayload, done: any) => {
  try {
    // payload의 id값으로 유저의 데이터 조회
    const user: user = await User.findOne({
      where: { userId: jwtPayload.userId },
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
    });
    // 유저 데이터가 있다면 유저 데이터 객체 전송
    if (user) {
      done(null, user);
      return;
    }
    // 유저 데이터가 없을 경우 에러 표시
    done(null, false, { message: "올바르지 않은 인증정보 입니다." });
    return;
  } catch (error) {
    done(error);
  }
};
export function jwt(){
  passport.use("jwt", new JWTStrategy(JWTConfig, JWTVerify));
};
