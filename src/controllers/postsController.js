const { Post } = require("../models");
const { Op } = require("sequelize");
const Joi = require("joi");
/* option + shift + a */

module.exports = {
  getPosts: async (req, res) => {
    const posts = await Post.findAll({
      where: {},
      limit: 10,
    });
    return res.send({});
  },
  postPosts: async (req, res) => {
    const {
      // headers: { token },
      // body: {
      //   imageCover,
      //   title,
      //   categorySpace,
      //   categoryStudyMates,
      //   categoryInterests,
      //   imageContents,
      //   textContent,
      //   youtubeUrl,
      // },
      file,
    } = req;
    //multipart 에서 json 형식으로 변환
    const body = JSON.parse(JSON.stringify(req.body));
    const {
      title,
      categorySpace,
      categoryStudyMate,
      categoryInterest,
      imageContent,
      textContent,
      youtubeUrl,
    } = body;

    const userId = 237237420;
    const date = new Date();
    const post = {
      userId: 312412,
      imageCover: file.path,
      title,
      categoryInterest,
      categorySpace,
      categoryStudyMate,
      imageContent,
      textContent,
      youtubeUrl,
      date,
    };
    try {
      await Post.create(post);
      return res.status(200).send({ message: "게시물 작성 성공!" });
    } catch (error) {
      return res.status(500).send({ message: "DB 저장에 실패했습니다." });
    }
  },
  putPosts: (req, res) => {
    // const { postId } = req.params;
    // const { path } = req.file;

    //postId로 해당 post 조회
    //파일 다시 저장
    //post 의 이미지 url 따라가서 삭제
    //req.files에서 path를 받아서 다시 DB에 저장

    console.log("PUT posts");
    return res.send({});
  },
  deletePosts: async (req, res) => {
    const { postId } = req.params;
    try {
      await Post.destroy({
        where: {
          postId,
        },
      });
      return res.status(200).send({ message: "포스팅 삭제 성공" });
    } catch (error) {
      console.log(error);
      return res.status(400).send({ message: "포스팅 삭제 실패" });
    }
  },
};
