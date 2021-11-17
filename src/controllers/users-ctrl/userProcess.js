const { User } = require("../../models");
const { Op } = require("sequelize");
const bcrypt = require("bcrypt");
const logger = require("../../config/logger");

//userProcess => user 관련 db 생성, 삭제 메소드 포함
const userProcess = {
  //회원 가입
  createUser: async (req, res) => {
    // 패스워드와 패스워드 확인 검증
    try {
      const { email, nickname, password, confirmPassword } = res.verifyBody;
      if (password !== confirmPassword) {
        message = "패스워드가 패스워드 확인란과 동일하지 않습니다.";
        logger.info(`POST /api/users/signup 400 res:${message}`);
        return res.status(400).send({ message });
      }

      // 패스워드에 아이디 포함여부 검사
      if (password.match(email) !== null || email.match(password) !== null) {
        message = "아이디가 포함된 비밀번호는 사용이 불가능합니다.";
        logger.info(`POST /api/users/signup 400 res:${message}`);
        return res.status(400).send({ message });
      }

      const existUsers = await User.findAll({
        where: {
          [Op.or]: [{ nickname }, { email }],
        },
      });

      //유효성 검사
      if (existUsers.length > 0) {
        message = "이미 가입된 이메일 또는 닉네임이 있습니다.";
        logger.info(`POST /api/users/signup 400 res:${message}`);
        res.status(400).send({ message });
      } else {
        date = new Date();
        const avatarUrl = "uploads/assets/noAvatar.png";
        const encryptPassword = bcrypt.hashSync(password, 10);
        const user = await User.create({
          email,
          nickname,
          password: encryptPassword,
          avatarUrl,
          date,
        });
        message = "회원가입에 성공했습니다.";
        logger.info(`POST /api/users/signup 201 res:${message}`);
        return res.status(201).send({ user, message });
      }
    } catch (error) {
      console.log(error);
      message = "알 수 없는 문제가 발생했습니다. 잠시 후 다시 시도해주세요.";
      logger.error(`POST /api/users/signup 500 res:${error}`);
      return res.status(500).send({ message });
    }
  },

  //회원탈퇴
  deleteUser: async (req, res) => {
    try {
      const { userId } = res.locals.user;
      console.log(userId);
      const existUser = await User.findOne({ where: { userId } });
      if (existUser) {
        await User.destroy({ where: { userId: existUser.userId } });
        message = "회원탈퇴가 완료되었습니다.";
        logger.info(`DELETE /api/users/withdrawal 400 res:${message}`);
        res.status(200).send({ message });
      } else {
        message = "회원탈퇴가 실패되었습니다.";
        logger.info(`DELETE /api/users/withdrawal 400 res:${message}`);
        res.stauts(400).send({ message });
      }
    } catch (error) {
      console.log(error);
      message = "알 수 없는 문제가 발생했습니다. 잠시 후 다시 시도해주세요.";
      logger.error(`DELETE /api/users/withdrawal 500 res:${error}`);
      res.status(500).send({
        message,
      });
    }
  },
};

module.exports = {
  userProcess,
};
