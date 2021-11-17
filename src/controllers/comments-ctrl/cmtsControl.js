const { logInOnly } = require("../../middlewares/passport-auth");
const db = require("../../models");
const { Comment, User, CommentLike } = require("../../models");
const { Sequelize } = require("../../models");
const { getPgNum } = require("../comments-ctrl/getPgNum");
const logger = require("../../config/logger");

const comments = {
  // 댓글 생성을 비동기식 방식으로 처리한다
  commentCreate: async (req, res) => {
    try {
      // const { textContent : 성공 } = { textContent : 성공 }
      const { textContent } = req.body;
      // const textContent = req.body.textContent => 구조분해할당 해제
      // const textContent = 성공
      const { postId } = req.params;
      const { userId } = res.locals.user;

      // user 변수에서 findByPk 를 통해 식별된 값을 가져온다
      const user = await User.findByPk(userId);
      // userNick 변수에서 사용자의 nickname을 선언한다
      const userNick = user.nickname;
      // avatarUrl 변수에서 사용자의 avatarUrl을 선언한다
      const avatarUrl = user.avatarUrl;
      // 날짜를 선언한다
      const date = new Date();
      // comment model에서 생성해주기 위해 create를 사용한다
      // comment 라는 변수에 저장하고자 하는 값을 넣어준다
      const comment = await Comment.create({
        userId,
        postId,
        date,
        textContent,
      });

      message = "댓글 작성에 성공했습니다.";
      logger.info(`POST api/posts/${postId}/comments 201 res:${message}`);
      // 성공 했을 경우, 다음과 같은 값을 보내준다
      return res.status(201).send({
        userNick,
        comment,
        avatarUrl,
        message,
      });
    } catch (error) {
      // 에러 발생 했을 경우, console.log를 찍어준다
      console.log(error);
      message = "알 수 없는 문제가 발생했습니다.";
      logger.error(`POST api/posts/${postId}/comments 500 res:${error}`);
      // try 구문에 에러가 생겼을 경우, 서버 에러로 인식하고 오류창을 보여준다
      return res.status(500).send({ message });
    }
  },

  // 댓글 조회
  commentSearch: async (req, res) => {
    try {
      // req.params로 postId를 할당 받음
      const { postId } = req.params;
      // const postId = req.params.postId; // ES5 및 이전 문법

      // comment db에서 값을 찾아보자
      const commentAll = await Comment.findAll({
        // db에서 찾을 때 할당 받은 postId와 같은 조건인 것을 찾음 (해당 게시글의 댓글만 가져오면 되서)
        where: { postId },
        // 가져올때 속성은 comment의 전부 + commentLikeCnt(commentLikeId의 갯수)
        attributes: [
          "Comment.*",
          "User.avatarUrl",
          "User.nickname",
          [
            Sequelize.literal("COUNT(DISTINCT CommentLikes.commentLikeId)"),
            "commentLikeCnt",
          ],
        ],
        /*  join!! (user, commentLike) ==> user는 작성자의 닉네임, 작성자의 프로필사진
        commentLike는 현재 미들웨어(loginBoth)를 타고 res.local.user가 있을 경우를 대비해서 그 사람이 각 댓글마다 
        좋아요를 했는지 안했는지 boolean 값을 주기 위해서 */
        include: [
          {
            model: User,
            attributes: [],
          },
          {
            model: CommentLike,
            attributes: [],
          },
        ],
        /* raw => google링 해보면 나옴
        가공 하지 않은 상태가 됨 {} <- 이런걸로 안감싸고, 바로 model.keyname으로 나옴 */
        raw: true,
        // group by 설정
        group: ["commentId"],
      });

      // 배열, 배열안에 객체(Object)를 저장
      const respondComments = [];
      for (const comment of commentAll) {
        // isCommentLiked 기본 값으로 false로 설정
        let isCommentLiked = false;
        // 사용자 인증 미들웨어를 타고 들어왔는데 사용자가 로그인 상태라면
        if (res.locals.user) {
          // 로그인 한 사용자가 현재의 포스트에서 좋아요를 했는지 db 검색
          const liked = await CommentLike.findOne({
            where: { userId: res.locals.user.userId, postId: comment.postId },
          });

          // 로그인 한 사용자가 현재의 포스트를 좋아요 했으면 true로 반환
          if (liked) isCommentLiked = true;
        }

        // 각 for문을 돌릴때의 필요한 값들 push
        respondComments.push({
          userId: comment.userId,
          userNickname: comment.nickname,
          textContent: comment.textContent,
          avatarUrl: comment.avatarUrl,
          date: comment.date, // 댓글 작성날짜 부분
          commentId: comment.commentId,
          postId: comment.postId,
          commentLikeCnt: comment.commentLikeCnt,
          isCommentLiked,
        });
      }

      // SQL part
      // const a = await Comment.findAll({
      //   where: { postId },
      //   attributes: ["Comment.*", "User.nickname", "User.avatarUrl"],
      //   include: {
      //     model: User,
      //     attributes: [],
      //   },
      //   //limit: 5,
      //   raw: true, //반환값이 object 형식으로 출력, 아니면 json형식
      //   order: [["date", "DESC"]],
      // });

      // added from nov.15-17, 2021 댓글 페이지리스팅
      const { pagination } = req.query;
      const cmtsList = await getPgNum(pagination, respondComments);
      // res 부분 처리를 getPgNum에서 insert하기에는 어려움 그래서 cmtsControl에서 처리
      if (cmtsList === null) {
        message = "댓글 리스트를 불러오는데 실패 했습니다.";
        logger.error(`GET /api/posts/${postId}/comments 400 res:${message}`);
        return res.status(400).send({ message });
      }

      // 성공 응답 코드
      message = "댓글 조회에 성공했습니다.";
      logger.info(`GET /api/posts/${postId}/comments 200 res:${message}`);
      return res.status(200).send({ cmtsList, message });
    } catch (error) {
      console.log(error);
      message = "알 수 없는 문제가 발생했습니다.";
      logger.error(`GET /api/posts/${postId}/comments 500 res:${error}`);
      return res.status(500).send({ message });
    }
  },

  // 댓글 삭제
  commentDel: async (req, res) => {
    try {
      // postId와 commentId 변수에서 req.params에 있는 값을 불러와 할당한다(구조분해할당)
      const { postId, commentId } = req.params;
      // res.locals.user 는 미들웨어인 loginOnly에서 값을 가져와 userId에 할당한다
      const { userId } = res.locals.user;
      // Comment 의 첫번째 요소만 보기 위해 데이터를 가져온다
      const reqDelete = await Comment.findOne({
        // where 옵션으로 나열함으로써, 기본적으로 and 옵션과 같다
        // postId 라는 컬럼에서 postId로, commentId 라는 컬럼에서 commentId로 가져온다
        where: { postId, commentId },
      });

      // 삭제할 요청의 아이디가 해당 유저의 아이디가 같다면
      if (reqDelete.userId === userId) {
        // 특정 포스트에 해당하는 특정 댓글을 지운다
        // 특정 포스트 -> 특정 댓글
        await reqDelete.destroy();
        // 댓글이 삭제되는 메세지를 제대로 보내졌을 경우
        message = "댓글이 삭제되었습니다.";
        logger.info(
          `DELETE /api/posts/${postId}/comments/${commentId} 200 res:${message}`
        );
        return res.status(200).send({ message });
        // 삭제할 댓글이 해당 유저의 아이디가 일치하지 않을 경우
      } else {
        message = "작성자가 아닙니다.";
        logger.info(
          `DELETE /api/posts/${postId}/comments/${commentId} 400 res:${message}`
        );
        return res.status(400).send({ message });
      }
    } catch (error) {
      console.log(error);
      // 댓글 기능이 제대로 작동하지 않을 경우
      message = "알 수 없는 문제가 발생했습니다.";
      logger.error(
        `DELETE /api/posts/${postId}/comments/${commentId} 500 res:${error}`
      );
      return res.status(500).send({ message });
    }
  },

  // 댓글 페이징
  commentPg: async (req, res) => {
    // const pageDate = {
    //   "curPage" : curPage,
    //   "pageListSize" : pageListSize,
    //   "pageSize" : pageSize,
    //   "totalPage" : totalPage,
    //   "totalSet" : totalSet,
    //   "curSet" : curSet,
    //   "startPage" : startPage,
    //   "endPage" : endPage
    // };
  },
};

module.exports = { comments };
