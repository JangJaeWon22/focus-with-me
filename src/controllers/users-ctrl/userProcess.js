const { User } = require("../../models");
const joiSchema = require("../../models/joi/joi");
const { Op } = require("sequelize");
const bcrypt = require("bcrypt");

const userProcess = {
  createUser: async (req, res) => {
    const { email, nickname, password, avatarUrl, confirmPassword } = req.body;
    try {
      await joiSchema.validateAsync({
        email,
        nickname,
        password,
        confirmPassword,
      });
    } catch (err) {
      return res.status(400).send({
        message: "아이디와 비밀번호의 형식이 올바르지 않습니다.",
      });
    }

    // 패스워드와 패스워드 확인 검증
    if (password !== confirmPassword) {
      return res.status(400).send({
        errorMessage: "패스워드가 패스워드 확인란과 동일하지 않습니다.",
      });
    }

    // 패스워드에 아이디 포함여부 검사
    if (password.match(email) !== null) {
      return res.status(400).send({
        message: "아이디가 포함된 비밀번호는 사용이 불가능합니다.",
      });
    }

    const existUsers = await User.findAll({
      where: {
        [Op.or]: [{ nickname }, { email }],
      },
    });

    //유효성 검사
    if (existUsers.length > 0) {
      res.status(400).send({
        message: "이미 가입된 이메일 또는 닉네임이 있습니다.",
      });
    } else {
      date = new Date();
      const encryptPassword = bcrypt.hashSync(password, 10);
      const user = await User.create({
        email,
        nickname,
        avatarUrl,
        password: encryptPassword,
        date,
      });
      res.status(201).send({
        user,
        message: "회원가입에 성공했습니다.",
      });
    }
  },
};

module.exports = {
  userProcess,
};
