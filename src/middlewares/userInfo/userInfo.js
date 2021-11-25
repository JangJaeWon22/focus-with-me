const { User, Post, sequelize, Sequelize } = require("../../models");
const { logger } = require("../../config/logger");

//유저 정보 가공(작성한 게시글 갯수 카운트)
const getUserInfo = async (req, res, next) => {
  try {
    // const { userId } = req.body === undefined ? res.locals.user : req.body;
    const { userId } = req.params;
    const userQuery = `
    SELECT Users.userId,Users.email,Users.nickname,Users.avatarUrl,Users.date,Users.provider, COUNT(Posts.userId) AS postCnt
    FROM Users
    LEFT OUTER JOIN Posts On Users.userId = Posts.userId
    WHERE Users.userId = ${userId}
    GROUP BY Users.userId
    ORDER BY date DESC;`;
    const userInfo = await sequelize.query(userQuery, {
      type: sequelize.QueryTypes.SELECT,
    });

    let isFollowing = false;
    if (res.locals.user) {
      const result = await sequelize.query(
        `SELECT * FROM Follow 
        WHERE Follow.followerId=${res.locals.user.userId} AND
        Follow.followingId=${userInfo[0].userId}`,
        {
          type: Sequelize.QueryTypes.SELECT,
        }
      );
      if (result.length !== 0) isFollowing = true;
    }
    res.isFollowing = isFollowing;
    res.userInfo = userInfo;
    next();
  } catch (error) {
    console.error(error);
    message = "알 수 없는 문제로 회원 정보를 가져오는데 실패 했습니다.";
    logger.error(`userInfo/userInfo middleware error: ${error}`);
    res.status(500).send({ message });
  }
};

module.exports = getUserInfo;
