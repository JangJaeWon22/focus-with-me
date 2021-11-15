const { Post, Bookmark, Like, User, sequelize } = require("../models");
const { removeImage } = require("../library/controlImage");

const {
  extractImageSrcS3,
  copyImagesS3,
  removeObjS3,
} = require("../library/controlS3");
/* option + shift + a */

module.exports = {
  /* 
    게시물 조회
  */
  getPosts: async (req, res) => {
    //조회는 미들웨어에서 처리하고, 여기는 던지는 역할만 하기
    const { randPosts, posts, totalPage } = req;
    const followPost = res.followPost;
    return res.status(200).send({
      message: "posts 조회 성공",
      posts,
      randPosts,
      followPost,
      totalPage,
    });
  },
  /* 
    게시물 생성
  */
  postPosts: async (req, res) => {
    // 사용자 인증 미들웨어 사용할 경우
    const { userId } = res.locals.user;
    const path = req.file
      ? `uploads${req.file.location.split("uploads")[1]}`
      : "";

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
    const imageList = extractImageSrcS3(contentEditor);
    // 비교 후 이동
    await copyImagesS3(imageList);

    // 모든 temp 경로를 content로 바꾸기
    const innerHtml = contentEditor.replace(/temp/g, "content");
    // 인코딩 해서 저장, why? 이모티콘
    const encodedTitle = encodeURIComponent(title);
    const encodedHTML = encodeURIComponent(innerHtml);
    const date = new Date();
    const post = {
      userId,
      imageCover: path,
      title: encodedTitle,
      categoryInterest,
      categorySpace,
      categoryStudyMate,
      contentEditor: encodedHTML,
      date,
    };
    try {
      await Post.create(post);
      return res.status(201).send({ message: "게시물 작성 성공!" });
    } catch (error) {
      console.log(error);
      return res.status(500).send({ message: "DB 저장에 실패했습니다." });
    }
  },
  /* 
    게시물 수정
  */
  putPosts: async (req, res) => {
    const { userId } = res.locals.user;
    const { postId } = req.params;
    // imageCover 파일이 없을 경우를 대비한 예외처리
    const path = req.file
      ? `uploads${req.file.location.split("uploads")[1]}`
      : null;
    const body = JSON.parse(JSON.stringify(req.body));
    const {
      title,
      categoryInterest,
      categorySpace,
      categoryStudyMate,
      contentEditor,
    } = body;

    const post = await Post.findByPk(postId);
    const backup = post;

    try {
      // throw "error occurs!!!!!!!!!";
      //조회 결과가 없으면 이미 업로드된 cover 파일 다시 지워야 함.
      if (!post) {
        await removeObjS3(path);
        return res
          .status(404)
          .send({ message: "해당 게시물이 존재하지 않습니다." });
      }
      //조회 결과 게시물 주인이 현재 로그인한 사람 소유가 아니면 꺼져
      if (userId !== post.userId) {
        await removeObjS3(path);
        return res
          .status(403)
          .send({ message: "본인의 게시물만 수정할 수 있습니다." });
      }
      // 기존 이미지 삭제하는 부분
      // post 의 이미지 url 따라가서 삭제
      // 기존 이미지 content 삭제
      const decodedHtml = decodeURIComponent(post.contentEditor);
      const imageList = extractImageSrcS3(decodedHtml);
      //새로 올라온 데이터가 있을 때만 바꾸기
      // 새로 올라온 파일이 있으면 -> imageCover path를 바꾸고, 기존 이미지 삭제
      if (path) {
        await removeImage(post.imageCover);
        post.imageCover = path;
      }
      // 수정 본문 이미지 처리가 안되어있음.
      if (title) post.title = encodeURIComponent(title);
      if (categorySpace) post.categorySpace = categorySpace;
      if (categoryInterest) post.categoryInterest = categoryInterest;
      if (categoryStudyMate) post.categoryStudyMate = categoryStudyMate;
      if (contentEditor) post.contentEditor = encodeURIComponent(contentEditor);
      await post.save();

      res.status(204).send({ message: "게시물 수정 성공" });
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
      await post.update(backup);
      await post.save();
      await removeImage(path);
      return res.status(500).send({ message: "DB 업데이트 실패" });
    }
  },
  /* 
    게시물 삭제
  */
  deletePosts: async (req, res) => {
    const { postId } = req.params;
    const { userId } = res.locals.user;

    try {
      //이미지도 지워야겠네??
      const post = await Post.findByPk(postId);
      if (userId !== post.userId)
        return res.status(403).send({ message: "주인 아님" });
      // 게시물 삭제 전, 이미지 src 추출하고 삭제
      const decodedHtml = decodeURIComponent(post.contentEditor);
      const imgList = extractImageSrcS3(decodedHtml);
      console.log(imgList);

      for (const src of imgList) {
        await removeObjS3(src);
      }
      await removeObjS3(post.imageCover);
      await post.destroy();
      return res.status(200).send({ message: "포스팅 삭제 성공" });
    } catch (error) {
      console.log(error);
      return res.status(500).send({ message: "포스팅 삭제 실패" });
    }
  },
  /* 
    특정 게시물 조회
  */
  getOnePost: async (req, res) => {
    const { postId } = req.params;
    // const userId = req.user ? req.user.userId : undefined;
    // 예외처리
    const { userId } = res.locals.user ? res.locals.user : { userId: null };
    // FE 뷰에 활용하기 위한 데이터
    let isBookmarked = false;
    let isLiked = false;
    let isFollowing = false;
    let currentNick = "";
    let currentAvatar = "";
    try {
      const post = await Post.findOne({
        where: { postId },
        include: {
          model: User,
          attributes: ["nickname", "avatarUrl"],
        },
      });
      // 사용자가 로그인 중이라면,
      if (userId) {
        const user = await User.findByPk(userId);
        currentNick = user.nickname;
        currentAvatar = user.avatarUrl;

        const bookmarked = await Bookmark.findOne({
          where: { postId, userId },
        });
        if (bookmarked) isBookmarked = true;
        const liked = await Like.findOne({
          where: { postId, userId },
        });
        if (liked) isLiked = true;
        // following 어떻게 판별하지??
        // 현재 로그인 한 사람이 게시물 작성자를 팔로잉하고 있는지??
        // 게시물 작성자의 userId를 가져와야 함
        const targetId = post.userId;
        const following = await sequelize.query(
          `SELECT * FROM Follow
        WHERE Follow.followingId=${targetId} AND Follow.followerId=${userId};`,
          { type: sequelize.QueryTypes.SELECT }
        );
        if (following.length !== 0) isFollowing = true;
      }
      return res.status(200).send({
        post,
        isBookmarked,
        isLiked,
        isFollowing,
        currentNick,
        currentAvatar,
      });
    } catch (error) {
      console.log(error);
      return res.status(500).send({ message: "DB 조회에 실패했습니다." });
    }
  },
  /* 
    ckEditor 본문 이미지 업로드
  */
  ckUpload: (req, res) => {
    const { user } = res.locals.user;
    const path = req.file.location;
    return res.status(201).send({ path });
  },
};
