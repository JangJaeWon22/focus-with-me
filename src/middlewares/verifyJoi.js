const Joi = require("joi");
const { logger } = require("../config/logger");

const verifyJoi = {
  //회원가입 시 joi 검증 실행
  singUpUser: async (req, res, next) => {
    const joiSchema = Joi.object({
      email: Joi.string()
        .email({ minDomainSegments: 2, tlds: { allow: ["com", "net"] } })
        .max(50)
        .required(),
      nickname: Joi.string().min(1).max(20).required(),
      password: Joi.string().regex(
        /^.*(?=^.{8,}$)(?=.*\d)(?=.*[a-zA-Z])(?=.*[!@#$%^&+=]).*$/
      ),
      confirmPassword: Joi.ref("password"),
    });
    const { email, nickname, password, confirmPassword } = req.body;
    try {
      const verifyBody = await joiSchema.validateAsync({
        email,
        nickname,
        password,
        confirmPassword,
      });
      res.verifyBody = verifyBody;
      next();
    } catch (error) {
      message = "아이디와 비밀번호의 형식이 올바르지 않습니다.";
      logger.info(`verifyJoi-singUpUser middlewares 500 error:${message}`);
      return res.status(500).send({ message });
    }
  },

  //회원정보 수정 시 joi 검증 실행
  updateUserProfile: async (req, res, next) => {
    console.log("조이 검증 미들웨어 입장");
    const joiSchema = Joi.object({
      nicknameNew: Joi.string().min(1).max(20).required(),
    });

    try {
      // 사용자 인증 미들웨어에서 값 들고 옴
      if (req.body.nicknameNew) {
        const { nicknameNew } = req.body;
        const verifyBody = await joiSchema.validateAsync({ nicknameNew });
        res.verifyBody = verifyBody;
        next();
      } else {
        message = "닉네임의 형식이 올바르지 않습니다.";
        logger.info(
          `verifyJoi-updateUserProfile middlewares 400 error:${message}`
        );
        return res.status(400).send({ message });
      }
    } catch (error) {
      console.log(error);
      message = "닉네임의 형식이 올바르지 않습니다.";
      logger.error(
        `verifyJoi-updateUserProfile middlewares 500 error:${error}`
      );
      return res.status(500).send({ message });
    }
  },

  updateUserPw: async (req, res, next) => {
    const joiSchema = Joi.object({
      passwordOld: Joi.string().regex(
        /^.*(?=^.{8,}$)(?=.*\d)(?=.*[a-zA-Z])(?=.*[!@#$%^&+=]).*$/
      ),
      passwordNew: Joi.string().regex(
        /^.*(?=^.{8,}$)(?=.*\d)(?=.*[a-zA-Z])(?=.*[!@#$%^&+=]).*$/
      ),
      confirmPasswordNew: Joi.ref("passwordNew"),
    });
    const { passwordOld, passwordNew, confirmPasswordNew } = req.body;
    try {
      ///비밀번호 변경을 하지 않을 경우 빈값으로 넘겨받아야됨
      if (!passwordNew || !confirmPasswordNew) {
        message = "변경할 비밀번호 또는 비밀번호 확인란을 확인 해주세요.";
        logger.info(`verifyJoi-updateUserPw middlewares 400 error:${message}`);
        return res.status(400).send({ message });
      } else {
        if (passwordNew !== confirmPasswordNew) {
          message = "변경할 비밀번호와 비밀번호 확인란이 일치하지 않습니다.";
          logger.info(
            `verifyJoi-updateUserPw middlewares 400 error:${message}`
          );
          return res.status(400).send({ message });
        } else {
          const verifyBody = await joiSchema.validateAsync({
            passwordOld,
            passwordNew,
            confirmPasswordNew,
          });
          res.verifyBody = verifyBody;
          next();
        }
      }
    } catch (error) {
      console.log(error);
      message = "입력하신 비밀번호의 형식이 올바르지 않습니다.";
      logger.error(`verifyJoi-updateUserPw middlewares 500 error:${error}`);
      return res.status(500).send({ message });
    }
  },
};

module.exports = { verifyJoi };
