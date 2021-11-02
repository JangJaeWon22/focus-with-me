const { Op, sequelize, Sequelize } = require("../models");
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
          include: {
            model: Like,
          },
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
        // 여기서 해야 할 일
        // 전체 게시물을 좋아요와 join 뒤에 좋아요 순으로 정렬, limit 10개만
        const postQuery = `
        SELECT Posts.*, COUNT(Likes.postId) AS cnt
        FROM Posts
        JOIN Likes On Posts.postId = Likes.postId
        GROUP BY Posts.postId
        ORDER BY cnt DESC;`;

        const posts = await sequelize.query(postQuery, {
          type: Sequelize.QueryTypes.SELECT,
        });
        // const posts = await Post.findAll({
        //   attributes: {
        //     include: [[Sequelize.fn("COUNT", "Likes.postId"), "cnt"]],
        //   },
        //   include: [
        //     {
        //       model: Like,
        //       attributes: [],
        //       right: true,
        //     },
        //   ],
        //   group: ["Post.postId"],
        // });
        console.log(posts);
        req.posts = posts;
        req.queryResult = { message: "쿼리 결과 : 메인" };
        next();
      })();
};

module.exports = { filter, main };
