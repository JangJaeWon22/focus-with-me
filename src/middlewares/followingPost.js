const { Post } = require("../models");

const followingPostMW = async (req, res, next) => {
  try {
    if (res.locals) {
      const followingIdList = res.locals.user
        ? res.locals.user.Followings.map((f) => f.userId)
        : [];
      const followPost = await Post.findAll({
        where: { userId: followingIdList },
        limit: 5,
        order: [["date", "DESC"]],
      });
      res.followPost = followPost;
      next();
    } else {
      res.followPost = [];
      next();
    }
  } catch (error) {
    console.log(error);
  }
};

module.exports = followingPostMW;
