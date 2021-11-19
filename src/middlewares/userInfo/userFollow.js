const { User } = require("../../models");
const { logger } = require("../../config/logger");

function follow(user) {
  user.followerCount = user ? user.Followers.length : 0;
  user.followingsCount = user ? user.Followings.length : 0;
  user.followingIdList = user ? user.Followings : [];
  user.followerIdList = user ? user.Followers : [];
  followerCount = user.followerCount;
  followingsCount = user.followingsCount;
  followingIdList = user.followingIdList;
  followerIdList = user.followerIdList;
}

const followMW = async (req, res, next) => {
  try {
    // const user = res.locals;
    // const { userId } = req.body === undefined ? res.locals.user : req.body;
    const { userId } = req.params;
    const user = await User.findOne({
      where: { userId },
      include: [
        {
          model: User,
          attributes: ["userId", "nickname", "avatarUrl"],
          as: "Followers",
        },
        {
          model: User,
          attributes: ["userId", "nickname", "avatarUrl"],
          as: "Followings",
        },
      ],
    });
    if (!user) {
      message = "조회 하려는 사용자가 없습니다.";
      logger.info(`userInfo/userFollow middleware error: ${message}`);
      return res.status(400).send({ message });
    } else {
      follow(user);
      next();
    }
  } catch (error) {
    console.log(error);
    message = "알 수 없는 문제로 회원 정보를 가져오는데 실패 했습니다.";
    logger.error(`userInfo/userFollow middleware catch error: ${error}`);
    res.status(500).send({ message });
  }
};

module.exports = followMW;
