const { User } = require("../../models");
const { Op } = require("sequelize");

const followProcess = {
  createFollow: async (req, res) => {
    try {
      const { user } = res.locals;
      const { nickname } = req.body;
      const userInfo = await User.findOne({ where: { nickname } });
      const existFollow = await userInfo.getFollowings({
        where: { userId: user.userId },
      });
      console.log(existFollow);
      // 사용자 있는지 체크
      if (userInfo) {
        // 사용자가 자신을 팔로우를 하지못하게 하기 위해 비료
        if (userInfo.userId !== user.userId) {
          // 사용자가
          if (!existFollow)
            await userInfo.addFollowing(parseInt(user.userId, 10));
          message = `${user.nickname}님이 ${userInfo.nickname}님을 팔로잉 했습니다.`;
          res.status(200).send({
            user,
            message,
          });
        } else {
          res.status(400).send({
            message: "자기 자신을 following 할 수 없습니다.",
          });
        }
      } else {
        res.status(400).send({
          message: "사용자를 찾을 수 없습니다.",
        });
      }
    } catch (err) {
      console.error(err);
      res.status(500).send({
        message: "알 수 없는 문제가 발생했습니다. 잠시 후 다시 시도해주세요.",
      });
    }
  },
  deleteFollow: async (req, res) => {
    try {
      const { user } = res.locals;
      const { nickname } = req.body;
      const userInfo = await User.findOne({ where: { nickname } });
      if (userInfo) {
        if (userInfo.userId !== user.userId) {
          await userInfo.removeFollowings(parseInt(user.userId, 10));
          message = `${user.nickname}님이 ${userInfo.nickname}님을 팔로잉 취소 했습니다.`;
          res.status(200).send({
            user,
            message,
          });
        } else {
          res.status(400).send({
            message: "자기 자신을 following 할 수 없습니다.",
          });
        }
      } else {
        res.status(400).send({
          message: "사용자를 찾을 수 없습니다.",
        });
      }
    } catch (error) {
      console.error(error);
      res.status(500).send({
        message: "알 수 없는 문제가 발생했습니다. 잠시 후 다시 시도해주세요.",
      });
    }
  },
};

module.exports = { followProcess };
