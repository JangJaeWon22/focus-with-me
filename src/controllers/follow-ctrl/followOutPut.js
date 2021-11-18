const { User, Follow } = require("../../models");
const { logger } = require("../../config/logger");

const followOutPut = {
  getFollowing: async (req, res) => {
    try {
      // 미들웨어를 통해 followingIdList 가지고와서 followingIdList 전송
      message = "팔로윙 중인 유저목록을 불러왔습니다.";
      logger.info(
        `GET /api/followings/${req.params.userId} 200 res:${message}`
      );
      res.status(200).send({ followingIdList, message });
    } catch (error) {
      // try에서 발생한 오류 catch해서 응답함
      console.error(error);
      message = "알 수 없는 문제가 발생했습니다. 잠시 후 다시 시도해주세요.";
      logger.error(`GET /api/followings/${req.params.userId} 500 res:${error}`);
      res.status(500).send({ message });
    }
  },
  getFollower: async (req, res) => {
    try {
      message = "팔로워 중인 유저목록을 불러왔습니다";
      logger.info(`GET /api/followers/${req.params.userId} 200 res:${message}`);
      res.status(200).send({ followerIdList, message });
    } catch (error) {
      console.error(error);
      message = "알 수 없는 문제가 발생했습니다. 잠시 후 다시 시도해주세요.";
      logger.error(`GET /api/followers/${req.params.userId} 500 res:${error}`);
      res.status(500).send({ message });
    }
  },
};

module.exports = { followOutPut };
