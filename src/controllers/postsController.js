const { Post } = require("../models");
const { Op } = require("sequelize");
const Joi = require("joi");
const fs = require("fs/promises");

const { removeImage } = require("../library/removeImage");
/* option + shift + a */

module.exports = {
  getPosts: async (req, res) => {
    //조회는 미들웨어에서 처리하고, 여기는 던지는 역할만 하기
    const posts = req.posts;
    const { queryResult } = req;
    return res
      .status(200)
      .send({ message: "posts 조회 성공", posts, queryResult });
  },
  postPosts: async (req, res) => {
    // 사용자 인증 미들웨어 사용할 경우
    // const { userId } = req.locals.user;

    const { path } = req.file;
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
      imageCover: path,
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
  putPosts: async (req, res) => {
    // 사용자 인증 미들웨어 사용 시
    // const { userId } = req.locals.user;
    const { postId } = req.params;
    const { path } = req.file;
    const {
      title,
      categorySpace,
      categoryInterest,
      categoryStudyMate,
      textContent,
      youtubeUrl,
    } = req.body;

    //postId로 해당 post 조회
    //조회 실패하면 파일 다시 지워야 함.
    const post = await Post.findByPk(postId);
    if (!post) {
      const result = await removeImage(path);
      console.log(result);
      return res
        .status(505)
        .send({ message: "해당 게시물이 존재하지 않습니다." });
    }

    //post 의 이미지 url 따라가서 삭제
    const removeUrl = post.imageCover;
    // try {
    //   await fs.unlink(removeUrl);
    // } catch (error) {
    //   console.log(error);
    //   return res.status(500).send({ message: "기존 이미지 삭제 실패" });
    // }
    // imageCover 업데이트 후 DB 다시 저장
    try {
      post.imageCover = path;
      post.title = title;
      post.categorySpace = categorySpace;
      post.categoryInterest = categoryInterest;
      post.categoryStudyMate = categoryStudyMate;
      post.textContent = textContent;
      post.youtubeUrl = youtubeUrl;
      await post.save();
      await removeImage(removeUrl);
      return res.status(200).send({ message: "게시물 수정 성공" });
    } catch (error) {
      console.log(error);
      return res.status(500).send({ message: "DB 업데이트 실패" });
    }
  },
  deletePosts: async (req, res) => {
    const { postId } = req.params;
    try {
      //이미지도 지워야겠네??
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
