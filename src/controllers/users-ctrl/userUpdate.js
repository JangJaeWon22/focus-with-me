const { User } = require("../../models");
const bcrypt = require("bcrypt");
const multer = require("multer");
const fs = require("fs");
//이미지 저장 폴더 생성
try {
  fs.readdirSync("public/uploads/avatar");
} catch (err) {
  console.log("uploads 폴더가 없어 uploads 폴더를 생성합니다.");
  fs.mkdirSync("public/uploads/avatar");
}

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
