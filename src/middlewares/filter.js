const { Post, User } = require("../models");

const filter = (req, res, next) => {
  const { searchMode } = req.query;
  searchMode === "main"
    ? next()
    : (async () => {
        console.log("여기는 필터할 미들웨어");
        req.queryResult = { message: "쿼리 결과 : 필터" };
        const posts = await Post.findAll({});
        console.log(posts);
        req.posts = posts;
        next();
      })();
};

const main = (req, res, next) => {
  const { searchMode } = req.query;
  searchMode === "filter"
    ? next()
    : (() => {
        console.log("여기는 메인 미들웨어");
        req.queryResult = { message: "쿼리 결과 : 메인" };
        next();
      })();
};

module.exports = { filter, main };
