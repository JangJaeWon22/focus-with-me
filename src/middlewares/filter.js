const { sequelize, Sequelize } = require("../models");
const { Post, User, Like, Bookmark } = require("../models");
const { Op } = require("sequelize");

const filter = async (req, res, next) => {
  const { searchMode } = req.query;
  if (searchMode === "main") {
    //여기에 유저 정보 보여주기
    // 좋아요 내림차순 10개, 랜덤 포스트 10개, 로그인한 경우 팔로잉 5개

    // 좋아요 내림차순 10개
    const postQuery = `
    SELECT Posts.*, COUNT(Likes.postId) AS likeCnt, Users.nickname, Users.avatarUrl
    FROM Posts
    JOIN Likes On Posts.postId = Likes.postId
    JOIN Users ON Posts.userId = Users.userId
    GROUP BY Posts.postId
    ORDER BY likeCnt DESC
    LIMIT 10;`;

    const posts = await sequelize.query(postQuery, {
      type: Sequelize.QueryTypes.SELECT,
    });

    // 랜덤 게시물 10개 조회
    const randPosts = await Post.findAll({
      // attributes: ["User.nickname", "User.avatarUrl"],
      include: {
        model: User,
        attributes: ["nickname", "avatarUrl"],
        // as: ["nickname", "avatarUrl"],
        separate: true,
      },
      order: [Sequelize.fn("RAND")],
      limit: 10,
    });

    // 로그인 했으면, 팔로잉 보여주기
    if (res.locals) {
      console.log("-----");
      console.log(res.locals);
      const followingIdList = res.locals.user
        ? res.locals.user.Followings.map((f) => f.userId)
        : [];
      const followPost = await Post.findAll({
        where: { userId: followingIdList },
        limit: 5,
        order: [["date", "DESC"]],
        include: {
          model: User,
          attributes: ["nickname", "avatarUrl"],
        },
      });
      res.followPost = followPost;
    } else {
      res.followPost = [];
    }
    // 만약 로그인이 되었을 경우, 팔로우하는 유저의 게시물 10개, 날짜 내림차순

    req.posts = posts;
    req.randPosts = randPosts;
    req.queryResult = { message: "쿼리 결과 : 메인" };
    next();
  } else {
    /* 
      적용되어야 할 것
      무한 스크롤 || 페이지네이션
      좋아요 개수, 북마크 개수.
      */
    const { categorySpace, categoryInterest, categoryStudyMate } = req.query;

    let where = [];
    if (categoryInterest) where.push({ categoryInterest });
    if (categorySpace) where.push({ categorySpace });
    if (categoryStudyMate) where.push({ categoryStudyMate });
    console.log(where);

    // 조인 후 배열이 아니라 count 함수 사용 예정
    const posts = await Post.findAll({
      where: {
        [Op.and]: where, // assign the "where" array here
      },
      include: [
        {
          model: Like,
        },
        {
          model: Bookmark,
        },
      ],
    });

    req.posts = posts;
    next();
  }
};

module.exports = { filter };
