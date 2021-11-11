const { Post, Bookmark, Like } = require("../../models");
const { Sequelize } = require("../../models");

const userInfoOutPut = {
  getUser: async (req, res) => {
    try {
      const userInfo = res.userInfo;
      res.status(200).send({
        userInfo,
        followerCount,
        followingsCount,
        message: "회원 정보 조회를 했습니다.",
      });
    } catch (error) {
      console.log(error);
      res.status(400).send({ message: "회원 정보 조회에 실패 했습니다." });
    }
  },
  getUserPost: async (req, res) => {
    try {
      const { userId } = req.params; // user 정보를 통으로 보내줌
      const postLists = await Post.findAll({
        where: { userId },
        attributes: [
          "Post.*",
          [Sequelize.literal("COUNT(DISTINCT Likes.likeId)"), "likeCnt"],
          [
            Sequelize.literal("COUNT(DISTINCT Bookmarks.bookmarkId)"),
            "bookCnt",
          ],
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
      const myPosts = [];
      for (const postList of postLists) {
        let isLiked = false;
        let isBookmarked = false;
        if (res.locals.user) {
          // 좋아요 했는지 check
          const liked = await Like.findOne({
            where: { userId: res.locals.user.userId, postId: postList.postId },
          });
          // 좋아요 했으면 true
          if (liked) isLiked = true;

          // 북마크 했는지 check
          const bookmarked = await Bookmark.findOne({
            where: { userId: res.locals.user.userId, postId: postList.postId },
          });
          // 북마크 했으면 true
          if (bookmarked) isBookmarked = true;
          // 배열에 삽입
          myPosts.push({
            postId: postList.postId,
            imageCover: postList.imageCover,
            title: postList.title,
            categorySpace: postList.categorySpace,
            categoryStudyMate: postList.categoryStudyMate,
            categoryInterest: postList.categoryInterest,
            contentEditor: postList.contentEditor,
            date: postList.date,
            userId: postList.userId,
            likeCnt: postList.likeCnt,
            bookCnt: postList.bookCnt,
            isLiked,
            isBookmarked,
          });
        } else {
          myPosts.push({
            postId: postList.postId,
            imageCover: postList.imageCover,
            title: postList.title,
            categorySpace: postList.categorySpace,
            categoryStudyMate: postList.categoryStudyMate,
            categoryInterest: postList.categoryInterest,
            contentEditor: postList.contentEditor,
            date: postList.date,
            userId: postList.userId,
            likeCnt: postList.likeCnt,
            bookCnt: postList.bookCnt,
            isLiked,
            isBookmarked,
          });
        }
      }

      res.status(200).send({ myPosts });
    } catch (error) {
      console.error(error);
      res.status(400).send({
        message: "알 수 없는 문제로 인해 정보를 가져오는데 실패했습니다.",
      });
    }
  },
  getUserBookmark: async (req, res) => {
    try {
      // 로그인 인증 미들웨어에서 userId 가져옴
      const { userId } = req.params;
      // 로그인 한 유저의 북마크 table의 postId를 가져와서 post 테이블에서 리스트를 뽑아서 옴
      const postLists = await Post.findAll({
        attributes: [
          "Post.*",
          [Sequelize.literal("COUNT(DISTINCT Likes.likeId)"), "likeCnt"],
          [
            Sequelize.literal("COUNT(DISTINCT Bookmarks.bookmarkId)"),
            "bookCnt",
          ],
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
      // ---------
      // 전체 포스트의 좋아요 갯수와 북마크 갯수를 가져옴
      // 그 중 params user가 북마크한 게시글만 보고 싶다..
      // 내가 북마크한 포스트를 불러오고
      const mybooks = await Bookmark.findAll({
        where: { userId },
      });

      // 전체 북마크와 내가 북마크한 포스트의 postId가 같은거만 삽입해보자
      myBookLists = [];
      for (const postList of postLists) {
        for (const mybook of mybooks) {
          if (postList.postId === mybook.postId) {
            myBookLists.push({
              postId: postList.postId,
              imageCover: postList.imageCover,
              title: postList.title,
              categorySpace: postList.categorySpace,
              categoryStudyMate: postList.categoryStudyMate,
              categoryInterest: postList.categoryInterest,
              contentEditor: postList.contentEditor,
              date: postList.date,
              userId: postList.userId,
              likeCnt: postList.likeCnt,
              bookCnt: postList.bookCnt,
            });
          }
        }
      }

      //그 후 liked와 bookmarked 추가
      const bookmarkedPosts = [];
      for (const myBookList of myBookLists) {
        let isLiked = false;
        let isBookmarked = false;
        if (res.locals.user) {
          // 좋아요 했는지 check
          const liked = await Like.findOne({
            where: {
              userId: res.locals.user.userId,
              postId: myBookList.postId,
            },
          });
          // 좋아요 했으면 true
          if (liked) isLiked = true;

          // 북마크 했는지 check
          const bookmarked = await Bookmark.findOne({
            where: {
              userId: res.locals.user.userId,
              postId: myBookList.postId,
            },
          });
          // 북마크 했으면 true
          if (bookmarked) isBookmarked = true;
          // 배열에 삽입
          bookmarkedPosts.push({
            postId: myBookList.postId,
            imageCover: myBookList.imageCover,
            title: myBookList.title,
            categorySpace: myBookList.categorySpace,
            categoryStudyMate: myBookList.categoryStudyMate,
            categoryInterest: myBookList.categoryInterest,
            contentEditor: myBookList.contentEditor,
            date: myBookList.date,
            userId: myBookList.userId,
            likeCnt: myBookList.likeCnt,
            bookCnt: myBookList.bookCnt,
            isLiked,
            isBookmarked,
          });
        } else {
          bookmarkedPosts.push({
            postId: myBookList.postId,
            imageCover: myBookList.imageCover,
            title: myBookList.title,
            categorySpace: myBookList.categorySpace,
            categoryStudyMate: myBookList.categoryStudyMate,
            categoryInterest: myBookList.categoryInterest,
            contentEditor: myBookList.contentEditor,
            date: myBookList.date,
            userId: myBookList.userId,
            likeCnt: myBookList.likeCnt,
            bookCnt: myBookList.bookCnt,
            isLiked,
            isBookmarked,
          });
        }
      }

      res.status(200).send({ bookmarkedPosts });
    } catch (error) {
      console.error(error);
      res.status(400).send({
        message: "알 수 없는 문제로 인해 정보를 가져오는데 실패했습니다.",
      });
    }
  },
};
module.exports = { userInfoOutPut };
