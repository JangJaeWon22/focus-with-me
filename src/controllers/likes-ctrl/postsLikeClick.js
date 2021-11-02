const { Like } = require("../../models");

const postList = {
  //게시물 좋아요 추가 기능//빈하트일때 좋아요 검사
  addLike: async (req, res) => {
    try {
      const { postId } = req.params;
      const userId = 1; //임시로 지정 //미들웨어 연결 후 변경
      const date = new Date();

      // isLiked는 기존에 userId에 해당하는 user가 좋아요를 한 적이 있는지 체크 하기 위해 db에서 검색
      const liked = await Like.findOne({
        where: { postId: postId, userId: userId },
      });

      //console.log(postId, userId, date);
      console.log(liked);
      // user가 좋아요를 안했을때
      if (!liked) {
        //좋아요 안 눌렀을때,
        const likes = await Like.create({
          postId,
          userId,
          date,
        }); //좋아요 생성 //값을 입력해주기
        return res.status(200).send({
          isLiked: true,
          message: "게시물에 좋아요를 눌렀습니다. ",
        });
        // user가 좋아요를 했을때
      } else {
        //좋아요 버튼을 또 누른 경우, 더블 클릭
        return res.status(400).send({ message: "좋아요를 이미 누르셨습니다." }); //알림창
      }
    } catch (err) {
      console.log(err);
      return res.status(400).send({
        message: "좋아요 구현에 문제가 있습니다. 관리자에게 문의해주세요. ",
      });
    }
  }, //게시물 좋아요 취소 기능
  removeLike: async (req, res) => {
    try {
      const { postId } = req.params;
      const userId = 2; //임시로 저장, 미들웨어 후 다시 연결

      const notLiked = await Like.findOne({
        where: { postId: postId, userId: userId },
      });
      //console.log("isNotLiked", isNotLiked);
      if (notLiked) {
        await Like.destroy({ where: { postId, userId } });
        return res.status(200).send({
          isLiked: false,
          message: "게시물에 좋아요 취소를 눌렀습니다. ",
        });
      } else {
        return res
          .status(400)
          .send({ message: "이미 좋아요를 취소하셨습니다." });
      }
    } catch (err) {
      console.log(err); //catch error 문 이렇게 확인
      return res.status(400).send({
        message:
          "좋아요 취소 구현에 문제가 있습니다. 관리자에게 문의해주세요. ",
      });
    }
  },
};

module.exports = { postList };
