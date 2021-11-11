const { User } = require("../../models");

const userExist = {
  existEmail: async (req, res) => {
    try {
      const { email } = req.body;
      const existEmail = await User.findOne({ where: { email } });
      if (!existEmail) {
        return res.status(200).send({ message: "사용 가능한 이메일 입니다." });
      } else {
        return res
          .status(400)
          .send({ message: "이미 사용중인 이메일 입니다." });
      }
    } catch (err) {
      console.log(err);
      return res.status(500).send({
        message: "알 수 없는 문제가 발생했습니다. 잠시 후 다시 시도해주세요.",
      });
    }
  },
  existNickname: async (req, res) => {
    try {
      const { nickname } = req.body;
      const existNickname = await User.findOne({ where: { nickname } });
      if (res.locals.user) {
        const user = res.locals.user;
        if (user.nickname == req.body.nickname) {
          return res.status(200).send({
            message: `기존 닉네임과 변동사항이 없습니다.`,
          });
        } else {
          return successMsg();
        }
      } else {
        if (!existNickname) {
          return successMsg();
        } else {
          return res
            .status(400)
            .send({ message: "이미 사용중인 닉네임 입니다." });
        }
      }
    } catch (err) {
      console.log(err);
      return res.status(500).send({
        message: "알 수 없는 문제가 발생했습니다. 잠시 후 다시 시도해주세요.",
      });
    }
    // success message
    function successMsg() {
      res.status(200).send({ message: "사용 가능한 닉네임 입니다." });
    }
  },
};

module.exports = { userExist };
