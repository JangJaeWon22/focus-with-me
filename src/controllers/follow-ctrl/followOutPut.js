const { User, Follow } = require("../../models");

const followOutPut = {
  getFollowing: async (req, res) => {
    try {
      res.status(200).send({
        followingIdList,
        message: "팔로윙 중인 유저목록을 불러왔습니다",
      });
    } catch (error) {
      console.error(error);
      res.status(400).send({
        message: "알 수 없는 문제가 발생했습니다. 잠시 후 다시 시도해주세요.",
      });
    }
  },
  getFollower: async (req, res) => {
    try {
      res.status(200).send({
        followerIdList,
        message: "팔로워 중인 유저목록을 불러왔습니다",
      });
    } catch (error) {
      console.error(error);
      res.status(400).send({
        message: "알 수 없는 문제가 발생했습니다. 잠시 후 다시 시도해주세요.",
      });
    }
  },
};

module.exports = { followOutPut };
