const { Bookmark } = require("../../models");

const bookmarkProcess = {
  createbookmark: async (req, res) => {
    try {
      console.log("hi");
      const { postId } = req.params;
      const { userId } = res.locals.user;
      const bookmark = await Bookmark.findByPk(userId);
      const date = new Date();
      if (bookmark) {
        await Bookmark.create({});
      } else {
      }
    } catch (err) {
      console.error(err);
      res.status(500).send({
        message: "알 수 없는 문제가 발생했습니다. 잠시 후 다시 시도해주세요.",
      });
    }
  },
};

module.exports = bookmarkProcess;
