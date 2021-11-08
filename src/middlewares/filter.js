const { sequelize, Sequelize } = require("../models");
const { Post, User, Like } = require("../models");
const { Op } = require("sequelize");
const filter = (req, res, next) => {
  const { searchMode } = req.query;
  searchMode === "main"
    ? next()
    : (async () => {
        /* 
        적용되어야 할 것
        무한 스크롤 || 페이지네이션
      */
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
        // 좋아요 내림차순 10개
        const postQuery = `
        SELECT Posts.*, COUNT(Likes.postId) AS likeCnt
        FROM Posts
        JOIN Likes On Posts.postId = Likes.postId
        GROUP BY Posts.postId
        ORDER BY likeCnt DESC
        LIMIT 10;`;

        const posts = await sequelize.query(postQuery, {
          type: Sequelize.QueryTypes.SELECT,
        });

        // 랜덤 게시물 10개 조회
        const randPosts = await Post.findAll({
          order: [Sequelize.fn("RAND")],
          limit: 10,
        });

        // 만약 로그인이 되었을 경우, 팔로우하는 유저의 게시물 10개, 날짜 내림차순
        // 코드 리펙터링 필요!!

        req.posts = posts;
        req.randPosts = randPosts;
        req.queryResult = { message: "쿼리 결과 : 메인" };
        next();
      })();
};

module.exports = { filter, main };
