const { Post } = require("../models");
const { Op } = require("sequelize");

module.exports = {
  getPosts: (req, res) => {
    return res.send({});
  },
  postPosts: async (req, res) => {
    const {
      // headers: { token },
      body: {
        imageCover,
        title,
        categorySpace,
        categoryStudyMates,
        categoryInterests,
        imageContents,
        textContent,
        youtubeUrl,
      },
    } = req;
    const userId = 237237420;
    const date = new Date();
    const post = {
      userId,
      imageCover,
      title,
      categoryInterests,
      categorySpace,
      categoryStudyMates,
      imageContents,
      textContent,
      youtubeUrl,
      date,
    };

    await Post.create(post);

    return res.status(200).send({ message: "게시물 작성 성공!" });
  },
  putPosts: (req, res) => {
    const { postId } = req.params;

    //postId로 해당 post 조회
    //파일 다시 저장
    //post 의 이미지 url 따라가서 삭제
    //req.files에서 path를 받아서 다시 DB에 저장

    console.log("PUT posts");
    return res.send({});
  },
  deletePosts: async (req, res) => {
    const { postId } = req.params;
    await Post.destory({
      where: {
        postId,
      },
    });

    return res.send({});
  },
};
