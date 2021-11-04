const followMW = (req, res, next) => {
  try {
    const user = res.locals;
    user.followerCount = user.user ? user.user.Followers.length : 0;
    user.followingsCount = user.user ? user.user.Followings.length : 0;
    user.followerIdList = user.user
      ? user.user.Followings.map((f) => f.nickname)
      : [];
    followerCount = user.followerCount;
    followingsCount = user.followingsCount;
    followerIdList = user.followerIdList;
    next();
  } catch (error) {
    console.log(error);
  }
};

module.exports = followMW;
