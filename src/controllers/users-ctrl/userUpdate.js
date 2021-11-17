const { User } = require("../../models");
const bcrypt = require("bcrypt");
const path = require("path");
// const { removeImage } = require("../../library/controlImage");
const { removeObjS3 } = require("../../library/controlS3");
const logger = require("../../config/logger");
// const fs = require("fs");
//이미지 저장 폴더 생성
// try {
//   fs.readdirSync("public/uploads/avatar");
// } catch (err) {
//   console.log("uploads 폴더가 없어 uploads 폴더를 생성합니다.");
//   fs.mkdirSync("public/uploads/avatar");
// }
// 프로필 수정 페이지 접근 시 회원 정보 먼저 조회
const userUpdate = {
  updateUserProfile: async (req, res) => {
    try {
      console.log("업데이트 라우터 입장");
      const { user } = res.locals;
      const { file } = req;
      let avatarUrl = "";
      // 닉네임입력란이 공백일 경우 대비
      const { nicknameNew } = res.verifyBody;

      //변경할 file이 있을 때
      // noAvatar 상태면, 파일 지우면 안됨
      // 파일이 없으면 유지
      if (file) {
        if (user.avatarUrl !== "uploads/assets/noAvatar.png") {
          // await removeImage(user.avatarUrl);
          await removeObjS3(user.avatarUrl);
        }
        avatarUrl = `uploads${file.location.split("uploads")[1]}`;
      } else {
        avatarUrl = user.avatarUrl;
      }
      // 기본 이미지로 돌아가려면??
      // 뷰에서 기본 이미지로 돌아가기 버튼??

      // 변경할 닉네임 중복 검사
      existNick = await User.findOne({ where: { nickname: nicknameNew } });

      if (!existNick) {
        // 중복 되는 내용이 없을 경우 update 진행
        await user.update({
          nickname: nicknameNew,
          avatarUrl,
        });
        message = "회원 정보 수정이 완료 되었습니다.";
        logger.info(`PUT /api/users/profileEdit 200 res:${message}`);
        return res.status(200).send({ user, message });
      } else if (
        // else if 중복되는 닉네임이 로그인한 user 자신의 닉네임일 경우를 비교
        existNick.nickname === nicknameNew &&
        existNick.userId === user.userId
      ) {
        await user.update({
          nickname: nicknameNew,
          avatarUrl,
        });
        message = "회원 정보 수정이 완료 되었습니다.";
        logger.info(`PUT /api/users/profileEdit 200 res:${message}`);
        return res.status(200).send({ user, message });
      } else {
        // 실패
        message = "중복된 닉네임입니다.";
        logger.info(`PUT /api/users/profileEdit 400 res:${message}`);
        return res.status(400).send({ message });
      }
    } catch (error) {
      console.log(error);
      message = "알 수 없는 문제가 발생했습니다. 잠시 후 다시 시도해주세요.";
      logger.error(`PUT /api/users/profileEdit 500 res:${error}`);
      return res.status(500).send({ message });
    }
  },
  updateUserPw: async (req, res) => {
    try {
      const { user } = res.locals;
      const { passwordOld, passwordNew } = res.verifyBody;
      const existUser = await User.findOne({ where: { userId: user.userId } });

      //등록된 유저가 있는지 다시 한번 조회
      if (existUser) {
        //기존 비밀번호 확인
        if (bcrypt.compareSync(passwordOld, existUser.password)) {
          const encryptPassword = bcrypt.hashSync(passwordNew, 10);
          await User.update(
            {
              password: encryptPassword,
            },
            { where: { userId: user.userId } }
          );
          const profile = await User.findOne({
            where: { userId: user.userId },
          });
          message = "회원정보 수정이 완료되었습니다.";
          logger.info(`PUT /api/users/edit 200 res:${message}`);
          res.status(201).send({ profile, message });
        } else {
          message = "입력하신 현재의 비밀번호가 일치하지 않습니다.";
          logger.info(`PUT /api/users/edit 400 res:${message}`);
          res.status(400).send({ message });
        }
      } else {
        message = "등록된 정보를 찾을 수 없습니다.";
        logger.info(`PUT /api/users/edit 400 res:${message}`);
        res.status(400).send({ message });
      }
    } catch (error) {
      console.log(error);
      message = "알 수 없는 문제가 발생했습니다. 잠시 후 다시 시도해주세요.";
      logger.info(`PUT /api/users/edit 500 res:${error}`);
      res.status(500).send({ message });
    }
  },
};

module.exports = { userUpdate };
