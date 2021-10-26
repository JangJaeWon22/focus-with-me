const { User } = require("../../models");
const Jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const dotenv = require("dotenv");
dotenv.config();

const userOutPut = {
  getUser: async (req, res) => {
    try {
      const { email, password } = req.body;
      const existUser = await User.findOne({ where: { email } });
      if (!existUser || !bcrypt.compareSync(password, existUser.password)) {
        return res.status(200).send({
          message: "잘못된 아이디 또는 패스워드입니다.",
        });
      }
      //회원정보 암호화
      const token = Jwt.sign({ email: existUser.email }, process.env.TOKEN_KEY);
      return res.status(201).send({
        message: "로그인에 성공하셨습니다",
        token,
      });
    } catch (err) {
      console.log(err);
      res.status(400).send({
        message: "알 수 없는 문제가 발생했습니다. 잠시 후 다시 시도해주세요",
      });
    }
  },
};

module.exports = { userOutPut };
