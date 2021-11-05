const { Post } = require("../models");
const { Op } = require("sequelize");
const fs = require("fs/promises");
const fsSync = require("fs");
const { removeImage, extractImageSrc } = require("../library/controlImage");
/* option + shift + a */

module.exports = {
  // 게시물 전체 조회
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
    const path = req.file ? req.file.path : "";
    // const { path } = req.file;
    //multipart 에서 json 형식으로 변환
    const body = JSON.parse(JSON.stringify(req.body));
    const {
      title,
      categorySpace,
      categoryStudyMate,
      categoryInterest,
      contentEditor,
    } = body;
    // image list 추출
    const imageList = extractImageSrc(contentEditor);
    // DB 저장 시에도 imageUrl을 사용하기 위해 let 선언
    let imageUrl = "";
    console.log(imageList);
    //image 리스트에 대해서 for 문을 돌려서 temp 폴더 확인
    imageList.forEach(async (url) => {
      const isExist = fsSync.existsSync(url);
      //파일이 존재하면, 파일 옮기기, img src 바꾸기
      if (isExist) {
        const fileName = url.split("/")[url.split("/").length - 1];
        imageUrl = `public/uploads/content/${fileName}`;
        await fs.rename(url, imageUrl);
      }
    });
    // const innerHtml = encodeURIComponent(
    // 모든 temp 경로를 content로 바꾸기
    const innerHtml = contentEditor.replace(/temp/g, "content");
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
    const { userId } = res.locals.user;
    console.log(res.locals.user);
    const { postId } = req.params;
    //이건 cover 이미지
    const path = req.file ? req.file.path : "";
    // const { path } = req.file;
    const body = JSON.parse(JSON.stringify(req.body));
    const {
      title,
      categoryInterest,
      categorySpace,
      categoryStudyMate,
      contentEditor,
    } = body;

    //데이터 바꾸기
    // imageCover 업데이트 후 DB 다시 저장
    try {
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
      if (userId !== post.userId)
        return res
          .status(401)
          .send({ message: "본인의 게시물만 수정할 수 있습니다." });

      // 기존 이미지 삭제하는 부분
      //post 의 이미지 url 따라가서 삭제
      await removeImage(post.imageCover);
      //기존 이미지 content 삭제
      const imageList = extractImageSrc(post.contentsEditor);

      //새로 올라온 데이터가 있을 때만 바꾸기
      if (path) post.imageCover = path;
      if (title) post.title = title;
      if (categorySpace) post.categorySpace = categorySpace;
      if (categoryInterest) post.categoryInterest = categoryInterest;
      if (categoryStudyMate) post.categoryStudyMate = categoryStudyMate;
      if (contentEditor) post.contentEditor = contentEditor;
      await post.save();

      res.status(200).send({ message: "게시물 수정 성공" });
      //성공하면 기존 이미지들 삭제 한 뒤에 return
      if (imageList.length !== 0) {
        imageList.forEach(async (src) => {
          await removeImage(src);
        });
      }
      return;
    } catch (error) {
      console.log(error);
      // 새로 넣으려던 데이터는 지운다. -> 원상복구 시켜야 함.
      // ROLLBACK : 기존데이터를 다시 넣고 저장.
      // 원상복구 해야할 요소 : 파일, DB
      // 기존 데이터를 어딘가에 백업해야할 듯.
      return res.status(500).send({ message: "DB 업데이트 실패" });
    }
  },
  //게시물 삭제
  deletePosts: async (req, res) => {
    const { postId } = req.params;
    const { userId } = res.locals.user;

    try {
      //이미지도 지워야겠네??
      const post = await Post.findByPk(postId);
      if (userId !== post.userId)
        return res.status(400).send({ message: "주인 아님" });

      const imgList = extractImageSrc(post.contentEditor);
      imgList.forEach(async (src) => {
        await removeImage(src);
      });
      await removeImage(post.imageCover);
      await post.destroy();

      return res.status(200).send({ message: "포스팅 삭제 성공" });
    } catch (error) {
      console.log(error);
      return res.status(400).send({ message: "포스팅 삭제 실패" });
    }
  },

  //상세 페이지
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
  // 업로드를 위한
  ckUpload: (req, res) => {
    const { user } = res.locals.user;
    console.log("res.locals : ", res.locals);
    console.log("user :", user);
    console.log("res.locals.user : ", res.locals.user);
    const { path } = req.file;
    return res.status(200).send({ path });
  },
};
