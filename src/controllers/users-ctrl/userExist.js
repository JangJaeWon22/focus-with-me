const { User } = require("../../models");

const userExist = {
  existEmail: async (req, res) => {
    try {
      const { email } = req.body;
      const existEmail = await User.findOne({ where: { email } });
      console.log(existEmail);
      if (!existEmail) {
        res.status(200).send({ message: "사용 가능한 이메일 입니다." });
      } else {
        res.status(400).send({ message: "이미 사용중인 이메일 입니다." });
      }
    } catch (err) {
      console.log(err);
      res.status(500).send({
        message: "알 수 없는 문제가 발생했습니다. 잠시 후 다시 시도해주세요.",
      });
    }
  },
  existNickname: async (req, res) => {
    try {
      const { nickname } = req.body;
      const existNickname = await User.findOne({ where: { nickname } });
      if (!existNickname) {
        res.status(200).send({ message: "사용 가능한 닉네임 입니다." });
      } else {
        res.status(400).send({ message: "이미 사용중인 닉네임 입니다." });
      }
    } catch (err) {
      console.log(err);
      res.status(500).send({
        message: "알 수 없는 문제가 발생했습니다. 잠시 후 다시 시도해주세요.",
      });
    }
  },
};

module.exports = { userExist };
