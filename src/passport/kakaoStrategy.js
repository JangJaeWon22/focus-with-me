const passport = require("passport");
const KakaoStrategy = require("passport-kakao").Strategy;
const { User } = require("../models");

module.exports = () => {
  console.log("hihihii");
  passport.use(
    "kakao",
    new KakaoStrategy(
      {
        clientID: process.env.KAKAO_ID,
        // callbackURL: "http://localhost:3000/api/kakao/callback",
        callbackURL: "/api/kakao/callback/abc",
      },
      async (accessToken, refreshToken, profile, done) => {
        console.log("accessToken:", accessToken);
        console.log("refreshToken:", refreshToken);
        console.log("profile", profile);
        const email = profile["_json"].kakao_account.email;
        const nickname = profile.displayName;
        const provider = "kakao";
        const date = new Date();
        const userInfo = await User.findOne({
          where: { snsId: profile.id, provider: "kakao" },
        });
        if (!userInfo) {
          const newUser = await User.create({
            email: email,
            nickname: nickname,
            snsId: profile.id,
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
};
