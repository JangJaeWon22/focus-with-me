const { Bookmark } = require("../../models");

const bookmarkProcess = {
  createbookmark: async (req, res) => {
    try {
      const { postId } = req.params;
      const { userId } = res.locals.user;
      const bookmark = await Bookmark.findOne({ where: { postId, userId } });
      const date = new Date();
      if (!bookmark) {
        await Bookmark.create({
          postId,
          userId,
          bookmark,
          date,
        });
        res.status(200).send({
          isBookmarked: true,
          message: "북마크를 완료 했습니다.",
        });
      } else {
        res.status(400).send({
          message: "북마크를 이미 했습니다.",
        });
      }
    } catch (err) {
      console.error(err);
      res.status(500).send({
        message: "알 수 없는 문제가 발생했습니다. 잠시 후 다시 시도해주세요.",
      });
    }
  },

  deleteBookmark: async (req, res) => {
    try {
      const { postId } = req.params;
      const { userId } = res.locals.user;
      console.log(userId);
      const bookmark = await Bookmark.findOne({ where: { postId, userId } });
      if (bookmark) {
        if (bookmark.userId === userId) {
          await Bookmark.destroy({
            where: { postId, userId },
          });
          res.status(200).send({
            isBookmarked: false,
            message: "북마크를 취소 했습니다.",
          });
        } else {
          res.status(400).send({
            message: "작성자가 아닙니다.",
          });
        }
      } else {
        res.status(400).send({
          message: "북마크 한 정보를 찾을 수 없습니다.",
        });
      }
    } catch (error) {
      console.error(error);
      res.status(500).send({
        message: "알 수 없는 문제가 발생했습니다. 잠시 후 다시 시도해주세요.",
      });
    }
  },
};

module.exports = { bookmarkProcess };
