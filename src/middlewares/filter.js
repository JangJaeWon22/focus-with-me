const { Op, Sequelize } = require("sequelize");
const { Post, User, Like } = require("../models");
// const { Sequelize, QueryTypes } = require("sequelize");
// const sequelize = new Sequelize("focus", "root", process.env.DB_PASSWORD, {
//   host: "localhost",
//   dialect: "mysql" /* one of 'mysql' | 'mariadb' | 'postgres' | 'mssql' */,
//   pool: {
//     max: 5,
//     min: 0,
//     idle: 10000,
//   },
// });
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
        const sqlQuery = `
        SELECT Posts.*, COUNT(Likes.postId) AS cnt
        FROM Posts
        JOIN Likes On Posts.postId = Likes.postId
        GROUP BY Posts.postId
        ORDER BY cnt ASC;`;

        // const posts = await Post.findAll({
        //   include: [{ model: Like }],
        // });
        // const posts = await Post.findAll({
        //   include: [
        //     {
        //       model: Like,
        //       attributes: [[Sequelize.fn("COUNT", "postId"), "cnt"]],
        //     },
        //   ],
        //   // attributes: {
        //   //   include: [
        //   //     [Sequelize.fn("COUNT", Sequelize.col("Likes.postId")), "cnt"],
        //   //   ],
        //   // },
        //   group: ["postId"],
        // });

        const posts = await Post.findAll({
          // attributes: {
          //   include: [
          //     [
          //       Sequelize.fn("COUNT", Sequelize.col("Likes.postId")),
          //       "sensorCount",
          //     ],
          //   ],
          // },
          include: [
            {
              model: Like,
            },
          ],
          // group: null,
        });
        console.log(posts);
        // const posts = await Post.findAll({
        //   where,
        //   limit: 10,
        //   include: [
        //     {
        //       model: User, // 게시글 작성자
        //       attributes: ["id", "nickname", "profileImg"],
        //     },
        //     {
        //       model: Image, // 게시글의 이미지
        //     },
        //     {
        //       model: Comment, // 게시글의 댓글
        //       include: [
        //         {
        //           model: User, //댓글을 쓴 사람
        //           attributes: ["id", "nickname", "profileImg"],
        //         },
        //       ],
        //     },
        //     {
        //       model: User, // 좋아요 누른 사람
        //       as: "Likers",
        //       attributes: ["id"],
        //     },
        //   ],
        //   order: [
        //     ["createdAt", "DESC"],
        //     [Comment, "createdAt", "DESC"],
        //   ],
        // });

        // const posts = await Post.findAll({
        //   include: [
        //     {
        //       model: Like,
        //     },
        //   ],
        // });
        console.log("여기는 메인 미들웨어");
        req.posts = posts;
        req.queryResult = { message: "쿼리 결과 : 메인" };
        next();
      })();
};

module.exports = { filter, main };
