const { CommentLike } = require("../../models");

const commentsLikeFunc = {
  // 댓글 좋아요 생성
  likeExist: async (req, res) => {
    try {
      const { postId, commentId } = req.params; // params에 postId, commentId 객체
      const { userId } = res.locals.user; // 미들웨어 연결에 필요
      
      // user가 이미 좋아요를 했는지 확인 
      const likeCmt = await CommentLike.findOne({
        where: { postId, commentId, userId },
      });

      // 댓글을 좋아한 적이 없는 초기화 상태에서 algorithm 시작 
      if(!likeCmt){
        const date = new Date();
        // 댓글 좋아요 생성
        await CommentLike.create({
          postId, userId, commentId, date,
        });
        // 댓글 카운터 기능
        const likeCount = await CommentLike.count({
          where: { commentId, postId },
        });
        // 댓글 카운터 수정 기능
        await CommentLike.update({ likeCount }, { where: {commentId:commentId}});

        // 댓글 상태 메세지 기능
        return res.status(200).send({
          isLiked: true,
          likeCount,
          message: "댓글에 좋아요를 눌렀습니다.",
        })
      }else{
        return res.status(400).send({ message: "좋아요를 이미 눌렀어요."});
      }
    } catch (err) {
      console.log(err);
      res.status(400).send({ message: "댓글 좋아요에 문제가 생겼습니다."})
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
        await CommentLike.destroy(
            { where: { postId, commentId, userId } }
        );

        // 댓글 카운더 기능
        const likeCount = await CommentLike.count({
          where: { commentId, postId, userId },
        });
        await CommentLike.update({ likeCount }, { where: {commentId:commentId}});
      
        // 댓글 상태 메세지 기능
        return res.status(200).send({
          isLiked: false,
          likeCount,
          message: "댓글 좋아요 해제 완료! 다음번에 더 좋은 댓글 좋아요 클릭해주세요.",
        });
      } else {
        return res.status(400).send({ message: "좋아요를 한 상태에서만 가능한 기능입니다." });
      }
    } catch (err) {
      console.log(err);
      return res.status(400).send({ message: "관리자에게 문의해주세요." });
    }
  },
}

// 댓글 라우터 연결
module.exports = { commentsLikeFunc }
