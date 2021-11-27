import { Request, Response } from "express";
import { Like } from "../../models";
import { logger } from "../../config/logger";
import { likepost } from "../../interfaces/likepost";

class postLikeController {
  // 게시물 좋아요 추가 기능
  // 빈하트일때 좋아요 검사
  public addLike =  async (req: Request, res: Response) => {
    // postId 변수에서 req.params에 있는 값을 불러와 할당한다(구조분해할당)
    const { postId } = req.params;
    try {
      // res.loLcals.user 는 미들웨어인 loginOnly에서 값을 가져와 userId에 할당한다
      const userId : number = res.locals.user.userId;
      const date = new Date();

      // isLiked는 기존에 userId에 해당하는 user가 좋아요를 한 적이 있는지 체크 하기 위해 db에서 검색
      // SQL Query clause : SELECT * FROM post WHERE postId = postId AND userId = userId;

      // Equal to :
      // const liked = await Like.findOne({
      //  where: { postId: postId, userId: userId },
      // });

      const liked: likepost = await Like.findOne({
        where: { postId:Number(postId), userId:Number(userId) },
      });

      // user가 좋아요를 누르기 전 일때
      if (!liked) {
        await Like.create({
          postId: Number(postId),
          userId: Number(userId),
          date,
        }); // 좋아요 생성
        const message: string = "좋아요를 눌렀습니다.";
        logger.info(`POST /api/posts/${postId}/like 200 res:${message}`);
        return res.status(200).send({ isLiked: true, message });
      } else {
        const message: string = "좋아요를 이미 눌렀습니다.";
        logger.info(`POST /api/posts/${postId}/like 400 res:${message}`);
        // user가 좋아요를 이미 누른 상태에서 한번 더 눌렀을 경우
        return res.status(400).send({ message });
      }
    } catch (error) {
      console.log(error);
      const message: string = "좋아요 기능에 문제가 있습니다. 관리자에게 문의해주세요.";
      logger.error(`POST /api/posts/${postId}/like 500 res:${error}`);
      return res.status(500).send({ message });
    }
  };
  // 게시물 좋아요 취소 기능
  public removeLike = async (req: Request, res: Response) => {
    const { postId } = req.params;
    try {
      
      const userId: Number = res.locals.user.userId;

      const liked : likepost = await Like.findOne({
        where: { postId:Number(postId), userId:Number(userId) },
      });

      if (liked) {
        await Like.destroy({
          liked
        });
        const message: string = "좋아요 취소";
        logger.info(`DELETE /api/posts/${postId}/like 200 res:${message}`);
        return res.status(200).send({ isLiked: false, message });
      } else {
        const message: string = "이미 좋아요를 취소했습니다.";
        logger.info(`DELETE /api/posts/${postId}/like 400 res:${message}`);
        return res.status(400).send({ message });
      }
    } catch (error) {
      console.log(error); // catch error 문 이렇게 확인
      const message: string = "좋아요 취소 기능에 문제가 있습니다. 관리자에게 문의해주세요.";
      logger.error(`DELETE /api/posts/${postId}/like 500 res:${error}`);
      return res.status(500).send({ message });
    }
  };
};

export default new postLikeController();
