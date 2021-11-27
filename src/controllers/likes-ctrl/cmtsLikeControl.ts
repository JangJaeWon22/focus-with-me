import { Request, Response } from "express";
//@ts-ignore
import { likecmt } from "../models";
//@ts-ignore
import { logger } from "../likes-ctrl";
//@ts-ignore
import { CommentLike } from "../interfaces/CommentLike";

class commentsLikeFunc {
  public likeExist = async (req: Request, res: Response) => {
    // params로 postId 받아옴
    const { postId, commentId } = req.params;
    // 미들웨어를 통해 userId 받아옴
    const userId: number = res.locals.user.userId;
    try {
      // 해당 postId와 userId를 가진 bookmark를 가져와 보자
      const cmts: CommentLike = await likecmt.findOne({
        where: { postId, commentId, userId },
      });

      // 북마크가 없을 때
      if (!cmts) {
        const date = new Date();
        // 북마크 추가 실행
        await likecmt.create({
          postId: Number(postId),
          userId,
          commentId,
          date,
        });
        const likeCount = await CommentLike.count({
            where: { postId, commentId },
        });
        // 성공 응답값 200 및 로그인 유저가 북마크 했으면 true값을 보내어 프론트에서 state 바로 적용.
        const message: string = "댓글 좋아요";
        logger.info(`POST /api/posts/${postId}/comments/${commentId}/like 200 res:${message}`);
        return res.status(200).send({ isLiked: true, likeCount, message });
        // 이미 북마크를 함.
      } else {
        const message: string = "좋아요를 이미 눌렀습니다.";
        logger.info(`POST /api/posts/${postId}/comments/${commentId}/like 400 res:${message}`);
        return res.status(400).send({ message });
      }
    } catch (error) {
      console.error(error);
      const message: string = "댓글 좋아요 기능에 문제가 발생했습니다.";
      logger.info(`POST /api/posts/${postId}/comments/${commentId}/like 500 res:${error}`);
      // try 구문에서 발생한 오류 catch해서 메세지 전송.
      return res.status(500).send({ message });
    }
  };

  public notLikeExist = async (req: Request, res: Response) => {
    // params로 postId 값 가져옴
    const { postId, commentId } = req.params;
    // 사용자 인증 미들웨어로 userId 값 받아옴
    const userId: number = res.locals.user.userId;
    try {
      // 해당 postId와 userId를 가진 bookmark를 가져와 보자
      const cmts : CommentLike = await likecmt.findOne({
        where: { postId, commentId, userId },
      });
      // 북마크가 있을 때
      if (cmts) {
          //해당 북마크 db 삭제
          await likecmt.destroy({ where: {postId, commentId, userId}});
          // 성공 응답값 200 및 로그인 유저가 북마크 취소하면 false값을 보내어 프론트에서 state 바로 적용.
          const likeCount = await CommentLike.count({
            where: { commentId, postId },
        });
          const message: string = "댓글 좋아요 취소";
          logger.info(`DELETE /api/posts/${postId}/comments/${commentId}/like 200 res:${message}`);
          return res.status(200).send({ isLiked: false, likeCount, message });
          // 북마크의 userId가 로그인한 userId가 다를 경우의 응답 값
        } else {
          const message: string = "좋아요를 한 상태에서만 가능한 기능입니다.";
          logger.info(`DELETE /api/posts/${postId}/comments/${commentId}/like 400 res:${message}`);
          res.status(400).send({ message });
        }
    } catch (error) {
      // try 구문에서 발생한 오류 catch해서 메세지 전송.
      console.error(error);
      const message: string =
        "관리자에게 문의해주세요.";
      logger.error(`DELETE /api/posts/${postId}/comments/${commentId}/like 500 res:${error}`);
      res.status(500).send({ message });
    }
  };
}

export default new commentsLikeFunc ();
