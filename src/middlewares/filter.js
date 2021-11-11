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
      attributes: ["Post.*", "User.nickname", "User.avatarUrl"],
      include: {
        model: User,
        attributes: [],
      },
      raw: true,
      order: [Sequelize.fn("RAND")],
      limit: 10,
    });

    // 로그인 했으면, 팔로잉 보여주기
    if (res.locals) {
      const followingIdList = res.locals.user
        ? res.locals.user.Followings.map((f) => f.userId)
        : [];
      const followPost = await Post.findAll({
        where: { userId: followingIdList },
        attributes: ["Post.*", "User.nickname", "User.avatarUrl"],
        include: {
          model: User,
          attributes: [],
        },
        raw: true,
        limit: 5,
        order: [["date", "DESC"]],
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
      --------------------------- 필터 페이지 -----------------------------------
      적용되어야 할 것
      무한 스크롤 || 페이지네이션
      좋아요 개수, 북마크 개수.
      
      각 카드별 좋아요?
      배열 선언 후 forEach push , Like 조회 Bookmark 조회

      */
    const { categorySpace, categoryInterest, categoryStudyMate } = req.query;

    let where = [];
    if (categoryInterest) where.push({ categoryInterest });
    if (categorySpace) where.push({ categorySpace });
    if (categoryStudyMate) where.push({ categoryStudyMate });
    // 조인 후 배열이 아니라 count 함수 사용 예정
    const posts = await Post.findAll({
      where: {
        [Op.and]: where, // assign the "where" array here
      },
      // 이렇게도 사용 가능
      // attributes: {
      //   include: [
      //     [Sequelize.literal("COUNT(DISTINCT Likes.likeId)"), "likeCnt"],
      //     [
      //       Sequelize.literal("COUNT(DISTINCT Bookmarks.bookmarkId)"),
      //       "bookCnt",
      //     ],
      //   ],
      // },
      attributes: [
        "Post.*",
        [Sequelize.literal("COUNT(DISTINCT Likes.likeId)"), "likeCnt"],
        [Sequelize.literal("COUNT(DISTINCT Bookmarks.bookmarkId)"), "bookCnt"],
      ],
      include: [
        {
          model: Like,
          attributes: [],
        },
        {
          model: Bookmark,
          attributes: [],
        },
      ],

      raw: true,
      group: ["postId"],
    });
    // sequelize equivalent SQL 이렇게도 사용 가능
    `use focus;
    SELECT Post.postId, Post.imageCover, Post.title, Post.categorySpace, Post.categoryStudyMate, Post.categoryInterest, Post.contentEditor, Post.date, Post.userId, 
    COUNT(DISTINCT Likes.likeId) AS likeCnt, 
    COUNT(DISTINCT Bookmarks.bookmarkId) AS bookCnt
    FROM Posts AS Post 
    LEFT OUTER JOIN Likes AS Likes ON Post.postId = Likes.postId 
    LEFT OUTER JOIN Bookmarks AS Bookmarks ON Post.postId = Bookmarks.postId 
    GROUP BY Post.postId;`;

    const arr = [];
    for (const post of posts) {
      console.log("로그인 상관어뵤이 여기로 와야 함");
      let userId;
      let isLiked = false;
      let isBookmarked = false;
      //로그인을 했다면 게시물에 좋아요 북마크 했는지 확인하는 로직 수행
      if (res.locals.user) {
        userId = res.locals.user.userId;
        const liked = await Like.findOne({
          where: { userId, postId: post.postId },
        });
        const bookmarked = await Bookmark.findOne({
          where: { userId, postId: post.postId },
        });
        console.log(liked);
        console.log(bookmarked);
        if (liked) isLiked = true;
        if (bookmarked) isBookmarked = true;
      }
      console.log("좋아요 북마크 확인 후 push 전");
      arr.push({
        postId: post.postId,
        imageCover: post.imageCover,
        title: post.title,
        categorySpace: post.categorySpace,
        categoryStudyMate: post.categoryStudyMate,
        categoryInterest: post.categoryInterest,
        contentEditor: post.contentEditor,
        date: post.date,
        userId: post.userId,
        likeCnt: post.likeCnt,
        bookCnt: post.bookCnt,
        isLiked,
        isBookmarked,
      });
    }
    console.log(arr);

    req.posts = arr;
    next();
  }
};

module.exports = { filter };
