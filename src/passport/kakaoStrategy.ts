import passport from "passport";
const KakaoStrategy = require("passport-kakao").Strategy;
import { User } from "../models";
import dotenv from 'dotenv';
dotenv.config();

export default function kakao() {
  passport.use(
    "kakao",
    new KakaoStrategy(
      {
        clientID : process.env.KAKAO_ID,
        callbackURL: process.env.KAKAO_CALLBACK,
      },
      async (accessToken: any, refreshTokenL: any, profile: any, done: any) => {
        console.log("profile", profile);
        const email = profile["_json"].kakao_account.email;
        let nickname = profile.displayName;
        const provider = "kakao";
        const avatarUrl = "uploads/assets/noAvatar.svg";
        const date = new Date();
        const userInfo = await User.findOne({
          where: { snsId: profile.id, provider: "kakao" },
        });
        const existNick = await User.findAll({ where: { nickname } });
        if (!userInfo) {
          if (existNick) {
            nickname = nickname + existNick.length;
          }
          const newUser = await User.create({
            email: email,
            nickname,
            snsId: profile.id,
            avatarUrl,
            provider,
            date,
          });
          console.log("회원 가입 햇음 passport/index로 넘어감 ㅂㅇ");
          return done(null, newUser);
        }
        console.log("회원 있따고 함 그래서 passport/index 넘어감 ㅅㄱ");
        return done(null, userInfo);
      }
    )
  );
}
