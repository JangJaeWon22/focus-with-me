const { Bookmark } = require("../../models");

const bookmarkProcess = {
  createbookmark: async (req, res) => {
    try {
      // params로 postId 받아옴
      const { postId } = req.params;
      // 미들웨어를 통해 userId 받아옴
      const { userId } = res.locals.user;
      // 해당 postId와 userId를 가진 bookmark를 가져와 보자
      const bookmark = await Bookmark.findOne({ where: { postId, userId } });
      // 날짜 생성
      const date = new Date();
      // 북마크가 없을 때
      if (!bookmark) {
        // 북마크 추가 실행
        await Bookmark.create({
          postId,
          userId,
          bookmark,
          date,
        });
        // 성공 응답값 200 및 로그인 유저가 북마크 했으면 true값을 보내어 프론트에서 state 바로 적용.
        res.status(200).send({
          isBookmarked: true,
          message: "북마크를 완료 했습니다.",
        });
        // 이미 북마크를 함.
      } else {
        res.status(400).send({
          message: "북마크를 이미 했습니다.",
        });
      }
    } catch (err) {
      console.error(err);
      // try 구문에서 발생한 오류 catch해서 메세지 전송.
      res.status(500).send({
        message: "알 수 없는 문제가 발생했습니다. 잠시 후 다시 시도해주세요.",
      });
    }
  },

  deleteBookmark: async (req, res) => {
    try {
      // params로 postId 값 가져옴
      const { postId } = req.params;
      // 사용자 인증 미들웨어로 userId 값 받아옴
      const { userId } = res.locals.user;
      // 해당 postId와 userId를 가진 bookmark를 가져와 보자
      const bookmark = await Bookmark.findOne({ where: { postId, userId } });
      // 북마크가 있을 때
      if (bookmark) {
        // 북마크의 userId가 로그인한 userId가 같을 경우
        if (bookmark.userId === userId) {
          //해당 북마크 db 삭제
          await bookmark.destroy();
          // 성공 응답값 200 및 로그인 유저가 북마크 취소하면 false값을 보내어 프론트에서 state 바로 적용.
          res.status(200).send({
            isBookmarked: false,
            message: "북마크를 취소 했습니다.",
          });
          // 북마크의 userId가 로그인한 userId가 다를 경우의 응답 값
        } else {
          res.status(400).send({
            message: "작성자가 아닙니다.",
          });
        }
        // 북마크가 없을 때의 응닶 값
      } else {
        res.status(400).send({
          message: "북마크 한 정보를 찾을 수 없습니다.",
        });
      }
    } catch (error) {
      // try 구문에서 발생한 오류 catch해서 메세지 전송.
      console.error(error);
      res.status(500).send({
        message: "알 수 없는 문제가 발생했습니다. 잠시 후 다시 시도해주세요.",
      });
    }
  },
};

module.exports = { bookmarkProcess };
