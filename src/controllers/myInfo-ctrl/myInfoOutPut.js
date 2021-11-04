const { Post, Bookmark } = require("../../models");
const { Op } = require("sequelize");

const myInfoOutPut = {
  getUser: async (req, res) => {
    try {
      const userInfo = res.userInfo;
      res.status(200).send({ userInfo, message: "회원 정보 조회를 했습니다." });
    } catch (error) {
      console.log(error);
      res.status(400).send({ message: "회원 정보 조회에 실패 했습니다." });
    }
  },
  getMyPost: async (req, res) => {
    try {
      const userInfo = res.userInfo;
      const { userId } = res.locals.user; // user 정보를 통으로 보내줌
      const myPost = await Post.findAll({ where: { userId } });
      res.status(200).send({ userInfo, myPost });
    } catch (error) {
      console.error(error);
      res.status(400).send({
        message: "알 수 없는 문제로 인해 정보를 가져오는데 실패했습니다.",
      });
    }
  },
  getMyBookmark: async (req, res) => {
    try {
      // 필요한 user정보를 myInfo 미들웨어에서 이쁘게 모아서 가져 옴
      const userInfo = res.userInfo;
      // 로그인 인증 미들웨어에서 userId 가져옴
      const { userId } = res.locals.user;
      // 로그인 한 유저의 북마크 table의 postId를 가져와서 post 테이블에서 리스트를 뽑아서 옴
      const posts = await Post.findAll({
        include: {
          model: Bookmark,
          // Bookmark table에서 userId가 로그인 한 유저꺼만 include 하기
          where: { userId },
        },
      });

      res.status(200).send({ userInfo, posts });
    } catch (error) {
      console.error(error);
      res.status(400).send({
        message: "알 수 없는 문제로 인해 정보를 가져오는데 실패했습니다.",
      });
    }
  },
};
module.exports = { myInfoOutPut };
