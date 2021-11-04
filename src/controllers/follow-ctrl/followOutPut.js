const { User } = require("../../models");

const followOutPut = {
  getFollowing: async (req, res) => {
    try {
      res.status(200).send({ user });
    } catch (error) {}
  },
  getFollower: async (req, res) => {
    try {
    } catch (error) {}
  },
};

module.exports = { followOutPut };
