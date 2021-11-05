const { User } = require("../../models");

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
    follow(user);
    next();
  } catch (error) {
    console.log(error);
  }
};

module.exports = followMW;
