const { User } = require("../../models");
const { Op } = require("sequelize");

const followProcess = {
  createFollow: async (req, res) => {
    try {
      const { userId } = req.body;
    } catch (err) {
      console.error(err);
      res.status(500).send({
        message: "알 수 없는 문제가 발생했습니다. 잠시 후 다시 시도해주세요.",
      });
    }
  },
};

module.exports = { followProcess };
