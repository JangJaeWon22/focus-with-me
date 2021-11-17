const { CommentLike } = require("../../models");
const logger = require("../../config/logger");

const commentsLikeFunc = {
  // 댓글 좋아요 생성
  likeExist: async (req, res) => {
    try {
      // params에 postId, commentId 객체
      const { postId, commentId } = req.params;
      // res.locals.user 는 미들웨어인 loginOnly에서 값을 가져와 userId에 할당한다
      const { userId } = res.locals.user;

      // user가 이미 좋아요를 했는지 확인하기 위해 CommentLike 를 조회
      const likeCmt = await CommentLike.findOne({
        where: { postId, commentId, userId },
      });

      // 댓글을 좋아한 적이 없는 초기화 상태에서 algorithm 시작
      if (!likeCmt) {
        const date = new Date();
        // 댓글 좋아요 생성
        await CommentLike.create({
          postId,
          userId,
          commentId,
          date,
        });
        // 댓글 카운터 기능 - 댓글의 수를 세어주기 위해서 만들어짐
        const likeCount = await CommentLike.count({
          where: { commentId, postId },
        });

        // 댓글 상태 메세지 기능
        message = "댓글 좋아요.";
        logger.info(
          `POST /api/posts/${postId}/comments/${commentId}/like 200 res:${message}`
        );
        return res.status(200).send({
          isLiked: true,
          likeCount,
          message,
        });
      } else {
        message = "좋아요를 이미 눌렀습니다.";
        logger.info(
          `POST /api/posts/${postId}/comments/${commentId}/like 400 res:${message}`
        );
        return res.status(400).send({ message });
      }
    } catch (error) {
      console.log(error);
      message = "댓글 좋아요 기능에 문제가 생겼습니다.";
      logger.error(
        `POST /api/posts/${postId}/comments/${commentId}/like 500 res:${error}`
      );
      return res.status(500).send({ message });
    }
  },
  // 댓글 좋아요 취소 생성
  notLikeExist: async (req, res) => {
    try {
      const { postId, commentId } = req.params;
      const { userId } = res.locals.user;

      const likeCmt = await CommentLike.findOne({
        where: { postId, commentId, userId },
      });

      // 댓글 좋아요 있는지 확인한 상태에서 algorithm 시작
      // 댓글 좋아요 있으면 delete 요청
      if (likeCmt) {
        await CommentLike.destroy({
          where: { postId, commentId, userId },
        });

        // 댓글의 수를 세어주는 기능
        // 댓글 카운터 기능 없이도 좋아요 추가와 삭제의 기능 작동이 잘 되지만,
        // commentId 와 postId 가 있어야 n-1 이 가능하고, userId 가 포함될 경우, 0 이 되기 때문에, userId를 지워주는 것이 맞음
        const likeCount = await CommentLike.count({
          where: { commentId, postId },
        });

        message = "댓글 좋아요 취소";
        logger.info(
          `DELETE /api/posts/${postId}/comments/${commentId}/like 200 res:${message}`
        );
        // 댓글 상태 메세지 기능
        return res.status(200).send({
          isLiked: false,
          likeCount,
          message,
        });
      } else {
        message = "좋아요를 한 상태에서만 가능한 기능입니다.";
        logger.info(
          `DELETE /api/posts/${postId}/comments/${commentId}/like 400 res:${message}`
        );
        return res.status(400).send({ message });
      }
    } catch (error) {
      console.log(error);
      message = "관리자에게 문의해주세요.";
      logger.error(
        `DELETE /api/posts/${postId}/comments/${commentId}/like 500 res:${error}`
      );
      return res.status(500).send({ message });
    }
  },
};

// 댓글 라우터 연결
module.exports = { commentsLikeFunc };
