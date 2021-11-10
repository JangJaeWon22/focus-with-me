const { User } = require("../../models");
const Jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();
const passport = require("passport");

const userOutPut = {
  // 회원 정보 조회
  getUser: async (req, res) => {
    try {
      const { user } = res.locals;
      console.log(user.userId);
      const userId = user.userId;
      const getUser = await User.findByPk(userId);
      res.status(200).send({ getUser, message: "회원 정보 조회를 했습니다." });
    } catch (error) {
      console.log(error);
      res.status(400).send({ message: "회원 정보 조회에 실패 했습니다." });
    }
  },

  authUser: async (req, res, next) => {
    // local 로그인
    try {
      // passport/index.js로 실행 됨
      passport.authenticate("local", (passportError, user, info) => {
        // 인증이 실패했거나 유저 데이터가 없다면 에러 발생
        if (passportError) {
          console.error("passportError:", passportError);
          return res.send({ message: passportError });
        }
        // user를 조회하지 못할 경우
        if (!user) {
          res.status(400).send({ message: info.message });
          return;
        }
        // user데이터를 통해 로그인 진행
        req.login(user, { session: false }, (loginError) => {
          if (loginError) {
            res.send(loginError);
            return;
          }
          //회원정보 암호화
          const token = Jwt.sign(
            { userId: user.userId },
            process.env.TOKEN_KEY,
            { expiresIn: "1d" }
          );
          res
            .status(201)
            .send({ token, user, message: "로그인에 성공하셨습니다." });
        });
      })(req, res, next);
    } catch (error) {
      console.error(error);
      next(error);
    }
  },
  kakaoCallback: async (req, res) => {
    try {
      console.log("넘어와찌롱");
      const user = req.user;
      const token = Jwt.sign({ userId: user.userId }, process.env.TOKEN_KEY);
      res.status(200).send({
        message: "로그인에 성공하였습니다.",
        token: token,
      });
    } catch (error) {
      console.log(error);
      res.status(500).send({
        message: "알 수 없는 문제가 발생했습니다. 잠시 후 다시 시도해주세요.",
      });
    }
  },
};
module.exports = { userOutPut };
