import { Request, Response } from 'express';
import { Post, Bookmark, Like, sequelize, Sequelize } from "../models"
import { logger } from "../config/logger"
import { MyBookLists, MyPosts, MyPostList, MyBookListsAdd } from "../interfaces/List"
import { BookmarkAttr } from "../interfaces/bookmark"
import { LikeAttr } from "../interfaces/like"

class UserInfoOutPut {
  // 회원 정보 조회
  public getUser = async (req: Request, res: Response) => {
    const userInfo = res.userInfo;
    const isFollowing = res.isFollowing;
    try {
      /*
        현재 로그인한 사람이 다른 사람 정보 페이지 갈 경우,
        로그인한 사람이 타겟을 팔로우하고 있는지? 아닌지? 판별할 것 
       */
      const message: string = "회원 정보 조회를 했습니다.";
      logger.info(
        `GET /api/mypage/myInfo/${req.params.userId} 200 res:${message}`
      );
      res.status(200).send({
        userInfo,
        followerCount,
        followingCount,
        message,
        isFollowing,
      });
    } catch (error) {
      console.log(error);
      const message: string = "회원 정보 조회에 실패 했습니다.";
      logger.error(
        `GET /api/mypage/myInfo/${req.params.userId} 500 res:${error}`
      );
      res.status(500).send({ message });
    }
  }
  public getUserPost = async (req: Request, res: Response) => {
    const { userId } = req.params; // user 정보를 통으로 보내줌
    try {
      const postLists = await Post.findAll({
        where: { userId: Number(userId) },
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
      const myPosts: MyPostList[] = [];
      for (const postList of postLists) {
        let isLiked = false;
        let isBookmarked = false;
        if (res.locals.user) {
          // 좋아요 했는지 check
          const liked: LikeAttr = await Like.findOne({
            where: { userId: Number(res.locals.user.userId), postId: Number(postList.postId)},
          });
          // 좋아요 했으면 true
          if (liked) isLiked = true;

          // 북마크 했는지 check
          const bookmarked : BookmarkAttr = await Bookmark.findOne({
            where: { userId: Number(res.locals.user.userId), postId: Number(postList.postId) },
          });
          // 북마크 했으면 true
          if (bookmarked) isBookmarked = true;
        }
        // 배열에 삽입
        myPosts.push({
          postId: postList.postId,
          coverOriginal: postList.coverOriginal,
          coverCropped: postList.coverCropped,
          // imageCover: postList.imageCover,
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

      const message: string = "작성하신 게시물을 조회했습니다.";
      logger.info(`GET /api/mypage/myposts/${userId} 200 res:${message}`);
      res.status(200).send({ myPosts, message });
    } catch (error) {
      console.error(error);
      const message: string = "알 수 없는 문제로 인해 정보를 가져오는데 실패했습니다.";
      logger.error(`GET /api/mypage/myposts/${userId} 500 res:${error}`);
      res.status(500).send({ message });
    }
  }
  public getUserBookmark =  async (req: Request, res: Response) => {
    const { userId } = req.params;
    try {
      // 로그인 한 유저의 북마크 table의 postId를 가져와서 post 테이블에서 리스트를 뽑아서 옴
      const postLists : MyPosts[] = await Post.findAll({
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
      const mybooks : BookmarkAttr[] = await Bookmark.findAll({
        where: { userId: Number(userId) },
      });

      // 전체 북마크와 내가 북마크한 포스트의 postId가 같은거만 삽입해보자
      const myBookLists: MyBookLists[] = [];
      for (const postList of postLists) {
        for (const mybook of mybooks) {
          if (postList.postId === mybook.postId) {
            myBookLists.push({
              postId: postList.postId,
              coverOriginal: postList.coverOriginal,
              coverCropped: postList.coverCropped,
              // imageCover: postList.imageCover,
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
      let bookmarkedPosts : MyBookListsAdd[] = [];
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
          // 북마크 했는지 check_
          const bookmarked = await Bookmark.findOne({
            where: {
              userId: res.locals.user.userId,
              postId: myBookList.postId,
            },
          });
          // 북마크 했으면 true
          if (bookmarked) isBookmarked = true;
        }
        // 배열에 삽입
        bookmarkedPosts.push({
          postId: myBookList.postId,
          coverOriginal: myBookList.coverOriginal,
          coverCropped: myBookList.coverCropped,
          // imageCover: myBookList.imageCover,
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
      const message: string = "북마크한 리스트를 조회 했습니다.";
      logger.info(`GET /mypage/mybookmarks/${userId} 200 res:${message}`);
      res.status(200).send({ bookmarkedPosts, message });
    } catch (error) {
      console.error(error);
      const message: string = "알 수 없는 문제로 인해 정보를 가져오는데 실패했습니다.";
      logger.error(`GET /mypage/mybookmarks/${userId} 500 res:${error}`);
      res.status(500).send({ message });
    }
  }
};
export default new UserInfoOutPut();
