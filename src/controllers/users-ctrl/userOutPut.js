const { User } = require("../../models");
const Jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();
const passport = require("passport");
const { logger } = require("../../config/logger");

const userOutPut = {
  authUser: async (req, res, next) => {
    // local 로그인
    try {
      // passport/index.js로 실행 됨
      passport.authenticate("local", (passportError, user, info) => {
        // 인증이 실패했거나 유저 데이터가 없다면 에러 발생
        if (passportError) {
          console.error("passportError:", passportError);
          logger.error(`POST /api/users/login 500 "res:${passportError}`);
          return res.status(500).send({ message: passportError });
        }
        // user를 조회하지 못할 경우
        if (!user) {
          res.status(400).send({ message: info.message });
          logger.info(`POST /api/users/login 400 "res:${info.message}`);
          return;
        }
        // user데이터를 통해 로그인 진행
        req.login(user, { session: false }, (loginError) => {
          if (loginError) {
            logger.error(`POST /api/users/login 400 "res:${loginError}`);
            res.send(loginError);
            return;
          }

          //회원정보 암호화
          const token = Jwt.sign(
            { userId: user.userId },
            process.env.TOKEN_KEY,
            { expiresIn: "1d" }
          );
          message = "로그인에 성공하셨습니다.";
          logger.info(`POST /api/users/login 201 "res: ${message}`);
          res.status(201).send({ token, user, message });
        });
      })(req, res, next);
    } catch (error) {
      console.error(error);
      message = "알 수 없는 문제가 발생했습니다. 잠시 후 다시 시도해주세요.";
      logger.error(`GET /api/kakao/callback 500 "res: ${error}`);
      next(error);
    }
  },
  kakaoCallback: async (req, res) => {
    try {
      console.log("넘어와찌롱");
      console.log("-----------------------------------------");
      console.log(req.session);
      const user = req.user;
      const token = Jwt.sign({ userId: user.userId }, process.env.TOKEN_KEY);
      message = "로그인에 성공하였습니다.";
      logger.info(`GET /api/kakao/callback 201 "res: ${message}`);
      res.status(201).send({ message, token });
    } catch (error) {
      console.log(error);
      message = "알 수 없는 문제가 발생했습니다. 잠시 후 다시 시도해주세요.";
      logger.error(`GET /api/kakao/callback 500 "res: ${error}`);
      res.status(500).send({ message });
    }
  },
};
module.exports = { userOutPut };
