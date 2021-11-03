const { Post } = require("../models");
const { Op } = require("sequelize");
const fs = require("fs/promises");
const fsSync = require("fs");
const { removeImage, extractImageSrc } = require("../library/removeImage");
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
  // 게시물 생성
  postPosts: async (req, res) => {
    // 사용자 인증 미들웨어 사용할 경우
    const { userId } = res.locals.user;
    // 여기서 받는 파일은 cover image
    const { path } = req.file;
    //multipart 에서 json 형식으로 변환
    const body = JSON.parse(JSON.stringify(req.body));
    const {
      title,
      categorySpace,
      categoryStudyMate,
      categoryInterest,
      contentsEditor,
    } = body;
    // image list 추출
    const imageList = extractImageSrc(contentsEditor);
    // DB 저장 시에도 imageUrl을 사용하기 위해 let 선언
    let imageUrl = "";
    console.log(imageList);
    //image 리스트에 대해서 for 문을 돌려서 temp 폴더 확인
    imageList.forEach(async (url) => {
      const isExist = fsSync.existsSync(url);
      //파일이 존재하면, 파일 옮기기, img src 바꾸기
      if (isExist) {
        const fileName = url.split("/")[url.split("/").length - 1];
        imageUrl = `public/uploads/content/${fileName}`;
        await fs.rename(url, imageUrl);
      }
    });
    // const innerHtml = encodeURIComponent(
    // contentsEditor.replaceAll("temp", "content")
    // );
    // 모든 temp 경로를 content로 바꾸기
    const innerHtml = contentsEditor.replace(/temp/g, "content");
    // const innerHtml = contentsEditor.replaceAll("temp", "content");
    const date = new Date();
    const post = {
      userId,
      imageCover: path,
      title,
      categoryInterest,
      categorySpace,
      categoryStudyMate,
      contentEditor: innerHtml,
      date,
    };
    try {
      console.log(post);
      await Post.create(post);
      return res.status(200).send({ message: "게시물 작성 성공!" });
    } catch (error) {
      console.log(error);
      return res.status(500).send({ message: "DB 저장에 실패했습니다." });
    }
  },
  // 게시물 수정
  putPosts: async (req, res) => {
    const { userId } = req.locals.user;
    const { postId } = req.params;
    const { path } = req.file;
    const body = JSON.parse(JSON.stringify(req.body));
    const {
      title,
      categoryInterest,
      categorySpace,
      categoryStudyMate,
      contentsEditor,
    } = body;
    //postId로 해당 post 조회
    const post = await Post.findByPk(postId);
    //조회 결과가 없으면 이미 업로드된 cover 파일 다시 지워야 함.
    if (!post) {
      await removeImage(path);
      return res
        .status(505)
        .send({ message: "해당 게시물이 존재하지 않습니다." });
    }

    //조회 결과 게시물 주인이 현재 로그인한 사람 소유가 아니면 꺼져
    // if(userId !==)

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
      const post = await Post.findByPk(postId);
      await removeImage(post.imageCover);
      await post.destroy();
      // await Post.destroy({
      //   where: {
      //     postId,
      //   },
      // });
      return res.status(200).send({ message: "포스팅 삭제 성공" });
    } catch (error) {
      console.log(error);
      return res.status(400).send({ message: "포스팅 삭제 실패" });
    }
  },
  getOnePost: async (req, res) => {
    const { postId } = req.params;

    try {
      const post = await Post.findByPk(postId);

      return res.status(200).send({ post });
    } catch (error) {
      console.log(error);
      return res.status(500).send({ message: "DB 조회에 실패했습니다." });
    }
  },
  ckUpload: (req, res) => {
    const { user } = res.locals.user;
    console.log("res.locals : ", res.locals);
    console.log("user :", user);
    console.log("res.locals.user : ", res.locals.user);
    const { path } = req.file;
    return res.status(200).send({ path });
  },
};
