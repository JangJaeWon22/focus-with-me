const { User } = require("../../models");
const bcrypt = require("bcrypt");
const multer = require("multer");

const userUpdate = {
  updateUser: async (req, res) => {
    try {
      const file = req.file;
      res.send({ file });
    } catch (err) {
      console.log(err);
    }
  },
};

module.exports = { userUpdate };
