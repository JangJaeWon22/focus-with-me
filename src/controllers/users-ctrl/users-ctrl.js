const e = require("express");
const { User } = require("../../models");
const { Op } = require("sequelize");
const bcrypt = require("bcrypt");

const userProcess = {
  createUser: async (req, res) => {
    try {
      const { email, nickname, password, avatarUrl, confirmPassword } =
        req.body;
      const isUser = await User.findOne({
        where: {
          [Op.or]: [{ email }, { nickname }],
        },
      });
      if (!isUser) {
        if (password === confirmPassword) {
          date = new Date();
          console.log("------------------------------");
          console.log(avatarUrl);
          const user = await User.create({
            email,
            nickname,
            avatarUrl,
            password,
            date,
          });
          res.status(201).send({
            user,
            message: "회원가입에 성공했습니다.",
          });
        } else {
          res.status(200).send({
            message: "입력하신 비밀번호가 일치하지 않습니다.",
          });
        }
      }
    } catch (err) {
      console.log(err);
      res.status(500).send({
        message: "알 수 없는 문제로 회원가입에 실패했습니다.",
      });
    }
  },
};

module.exports = {
  userProcess,
};
