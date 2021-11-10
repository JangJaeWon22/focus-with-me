const { Like } = require("../../models");

const postList = {
  // 게시물 좋아요 추가 기능
  // 빈하트일때 좋아요 검사
  addLike: async (req, res) => {
    try {
      // postId 변수에서 req.params에 있는 값을 불러와 할당한다(구조분해할당) 
      const { postId } = req.params;
      // res.locals.user 는 미들웨어인 loginOnly에서 값을 가져와 userId에 할당한다
      const { userId } = res.locals.user; 
      const date = new Date();

      // isLiked는 기존에 userId에 해당하는 user가 좋아요를 한 적이 있는지 체크 하기 위해 db에서 검색
      // SQL Query clause : SELECT * FROM post WHERE postId = postId AND userId = userId;
      
      // Equal to :
      // const liked = await Like.findOne({
      //  where: { postId: postId, userId: userId },
      // });
      
      const liked = await Like.findOne({
        where: { postId, userId },
      });

      // user가 좋아요를 누르기 전 일때
      if (!liked) {
        await Like.create({
          postId,
          userId,
          date,
        }); // 좋아요 생성 
        return res.status(200).send({
          isLiked: true,
          message: "좋아요를 눌렀습니다.",
        });
      } else {
        // user가 좋아요를 이미 누른 상태에서 한번 더 눌렀을 경우
        return res.status(400).send({ 
          message: "좋아요를 이미 누르셨습니다." 
        }); // 알림창
      }
    } catch (err) {
      console.log(err);
      return res.status(500).send({
        message: "좋아요 기능에 문제가 있습니다. 관리자에게 문의해주세요.",
      });
    }
  },
  // 게시물 좋아요 취소 기능
  removeLike: async (req, res) => {
    try {
      const { postId } = req.params;
      const { userId } = res.locals.user; 

      const liked = await Like.findOne({
        where: { postId, userId },
      });

      if (liked) {
        await liked.destroy();
        return res.status(200).send({
          isLiked: false,
          message: "좋아요 취소를 했습니다.",
        });
      } else {
        return res.status(400).send({ 
          message: "이미 좋아요를 취소하셨습니다.", 
        });
      }
    } catch (err) {
      console.log(err); // catch error 문 이렇게 확인
      return res.status(500).send({
        message:
          "좋아요 취소 기능에 문제가 있습니다. 관리자에게 문의해주세요.",
      });
    }
  },
};

module.exports = { postList };
