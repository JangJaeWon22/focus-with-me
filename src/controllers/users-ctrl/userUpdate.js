const { User } = require("../../models");
const bcrypt = require("bcrypt");
const multer = require("multer");
const path = require("path");
const { removeImage } = require("../../library/controlImage");
const fs = require("fs");
//이미지 저장 폴더 생성
try {
  fs.readdirSync("public/uploads/avatar");
} catch (err) {
  console.log("uploads 폴더가 없어 uploads 폴더를 생성합니다.");
  fs.mkdirSync("public/uploads/avatar");
}

const userUpdate = {
  updateUserProfile: async (req, res) => {
    try {
      const { user } = res.locals;
      const { file } = req;
      const { nicknameNew } = res.verifyBody;
      // let nicknameNew =
      //req.body.nicknameNew === "" ? user.nickname : req.body.nicknameNew;
      const existUser = await User.findOne({
        where: { nickname: nicknameNew },
      });
      //변경할 file이 있을 때
      if (file) {
        await removeImage(existUser.avatarUrl);
        avatarUrl = file.path;
      } else {
        avatarUrl = "public/avatar/noAvatar";
      }

      // 닉네임 중복 검사
      if (!existUser) {
        await User.update(
          {
            nickname: nicknameNew,
            avatarUrl,
          },
          { where: { userId: user.userId } }
        );
        res.status(200).send({
          message: "프로필사진 업데이트를 완료 했습니다.",
        });
      } else {
        res.status(400).send({
          message: "이미 사용중인 닉네임 입니다",
        });
      }
    } catch (err) {
      console.log(err);
      res.status(500).send({
        message: "알 수 없는 문제가 발생했습니다. 잠시 후 다시 시도해주세요.",
      });
    }
  },
  updateUserPw: async (req, res) => {
    try {
      const { user } = res.locals;
      const { file } = req;
      const { nicknameNew, passwordOld, passwordNew } = res.verifyBody;
      console.log(res.verifyBody);
      const existUser = await User.findOne({ where: { userId: user.userId } });
      //변경할 file이 있을 때 (+계정에 프로필 사진이 등록이 되어 있을 때를 해야될지 고민)
      if (file) {
        await removeImage(existUser.avatarUrl);
      } else {
        //프로필 사진을 변경 안할때
        file = existUser;
      }

      //등록된 유저가 있는지 다시 한번 조회
      if (existUser) {
        //기존 비밀번호 확인
        if (bcrypt.compareSync(passwordOld, existUser.password)) {
          const encryptPassword = bcrypt.hashSync(passwordNew, 10);
          await User.update(
            {
              nickname: nicknameNew,
              password: encryptPassword,
              avatarUrl: file.path,
            },
            { where: { userId: user.userId } }
          );
          res.status(201).send({ message: "회원정보 수정이 완료되었습니다." });
        } else {
          res.status(400).send({
            message: "입력하신 현재의 비밀번호가 일치하지 않습니다.",
          });
        }
      } else {
        res.status(400).send({
          msg: "등록된 정보를 찾을 수 없습니다.",
        });
      }
    } catch (err) {
      console.log(err);
      res.status(500).send({
        message: "알 수 없는 문제가 발생했습니다. 잠시 후 다시 시도해주세요.",
      });
    }
  },
};

module.exports = { userUpdate };
