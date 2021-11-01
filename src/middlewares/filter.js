const { Op } = require("sequelize");
const { Post, User, Like } = require("../models");

const filter = (req, res, next) => {
  const { searchMode } = req.query;
  searchMode === "main"
    ? next()
    : (async () => {
        const { categorySpace, categoryInterest, categoryStudyMate } =
          req.query;

        let where = [];
        if (categoryInterest) where.push({ categoryInterest });
        if (categorySpace) where.push({ categorySpace });
        if (categoryStudyMate) where.push({ categoryStudyMate });
        console.log(where);
        const posts = await Post.findAll({
          where: {
            [Op.and]: where, // assign the "where" array here
          },
          limit: 10,
        });
        req.posts = posts;
        next();
      })();
};

const main = (req, res, next) => {
  const { searchMode } = req.query;
  searchMode === "filter"
    ? next()
    : (async () => {
        const posts = await Post.findAll({
          include: [
            {
              model: Like,
            },
          ],
        });
        console.log("하하하", posts);
        console.log("여기는 메인 미들웨어");
        req.posts = posts;
        req.queryResult = { message: "쿼리 결과 : 메인" };
        next();
      })();
};

module.exports = { filter, main };
