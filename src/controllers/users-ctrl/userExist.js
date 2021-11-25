const { User } = require("../../models");
const { logger } = require("../../config/logger");

const userExist = {
  existEmail: async (req, res) => {
    try {
      const { email } = req.verifyBody;
      const existEmail = await User.findOne({ where: { email } });
      if (!existEmail) {
        message = "사용 가능한 이메일 입니다.";
        logger.info(`POST /api/users/emailexist 200 "res:${message}`);
        return res.status(200).send({ message });
      } else {
        message = "이미 사용중인 이메일 입니다.";
        logger.info(`POST /api/users/emailexist 400 "res:${message}`);
        return res.status(400).send({ message });
      }
    } catch (error) {
      console.log(error);
      message = "알 수 없는 문제가 발생했습니다. 잠시 후 다시 시도해주세요.";
      logger.error(`POST /api/users/emailexist 500 "res:${error}`);
      return res.status(500).send({ message });
    }
  },
  existNickname: async (req, res) => {
    try {
      const { nickname } = req.verifyBody;
      const existNickname = await User.findOne({ where: { nickname } });
      if (res.locals.user) {
        const user = res.locals.user;
        if (user.nickname == req.verifyBody.nickname) {
          message = "기존 닉네임과 변동사항이 없습니다.";
          logger.info(`POST /api/users/nicknameexist 200 "res:${message}`);
          return res.status(200).send({ message });
        } else if (existNickname) {
          message = "이미 사용중인 닉네임 입니다.";
          logger.info(`POST /api/users/nicknameexist 400 "res:${message}`);
          return res.status(400).send({ message });
        } else {
          return successMsg();
        }
      } else {
        if (!existNickname) {
          return successMsg();
        } else {
          message = "이미 사용중인 닉네임 입니다.";
          logger.info(`POST /api/users/nicknameexist 400 "res:${message}`);
          return res.status(400).send({ message });
        }
      }
    } catch (error) {
      console.log(error);
      message = "알 수 없는 문제가 발생했습니다. 잠시 후 다시 시도해주세요.";
      logger.error(`POST /api/users/nicknameexist 500 "res:${error}`);
      return res.status(500).send({ message });
    }
    // success message
    function successMsg() {
      message = "사용 가능한 닉네임 입니다";
      logger.info(`POST /api/users/nicknameexist 200 "res:${message}`);
      res.status(200).send({ message });
    }
  },
};

module.exports = { userExist };
