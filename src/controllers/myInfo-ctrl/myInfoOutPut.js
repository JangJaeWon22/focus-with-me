const { User, Post } = require("../../models");

const myInfoOutPut = {
  getUser: async (req, res) => {
    try {
      const userInfo = res.userInfo;
      res.status(200).send({ userInfo, message: "회원 정보 조회를 했습니다." });
    } catch (error) {
      console.log(error);
      res.status(400).send({ message: "회원 정보 조회에 실패 했습니다." });
    }
  },
  getMyPost: async (req, res) => {
    try {
      const userInfo = res.userInfo;
      const { userId } = res.locals.user; // user 정보를 통으로 보내줌
      const myPost = await Post.findAll({ where: { userId } });
      res.status(200).send({ userInfo, myPost });
    } catch (error) {
      console.error(error);
      res.status(400).send({
        message: "알 수 없는 문제로 인해 정보를 가져오는데 실패했습니다.",
      });
    }
  },
};
module.exports = { myInfoOutPut };
