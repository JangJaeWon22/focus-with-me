const { User } = require("../../models");
const Jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const dotenv = require("dotenv");
dotenv.config();
const passport = require("passport");

const userOutPut = {
  authUser: async (req, res) => {
    try {
      // 아까 local로 등록한 인증과정 실행
      passport.authenticate("local", (passportError, user, info) => {
        // 인증이 실패했거나 유저 데이터가 없다면 에러 발생
        if (passportError || !user) {
          res.status(400).json({ message: info.reason });
          return;
        }
        // user데이터를 통해 로그인 진행
        req.login(user, { session: false }, (loginError) => {
          console.log(user);
          if (loginError) {
            res.send(loginError);
            return;
          }
          //회원정보 암호화
          const token = Jwt.sign({ email: user.email }, process.env.TOKEN_KEY);
          res.status(201).send({ token, message: "로그인에 성공하셨습니다." });
        });
      })(req, res);
    } catch (error) {
      console.error(error);
      next(error);
    }
  },
};

module.exports = { userOutPut };
