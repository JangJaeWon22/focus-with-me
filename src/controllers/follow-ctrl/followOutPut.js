const { User } = require("../../models");

const followOutPut = {
  getFollowing: async (req, res) => {
    try {
      const { userId } = res.locals.user;
      const user = res.locals.user;
      const userInfo = await User.findOne({ where: { userId } });
      const aaa = await userInfo.getFollowings();
      const bbb = await userInfo.getFollowers();
      console.log(aaa);
      console.log("bbb : ", bbb);
      res.status(200).send({ aaa, bbb, user });
    } catch (error) {
      console.error(error);
      res.status(400).send({
        message: "알 수 없는 문제가 발생했습니다. 잠시 후 다시 시도해주세요.",
      });
    }
  },
  getFollower: async (req, res) => {
    try {
    } catch (error) {}
  },
};

module.exports = { followOutPut };
