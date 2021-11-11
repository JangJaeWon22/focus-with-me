const { Comment, User, CommentLike } = require("../../models");
const { Sequelize } = require("../../models");

const comments = {
  // 댓글 생성
  commentCreate: async (req, res) => {
    try {
      // const { textContent : 성공 } = { textContent : 성공 }
      const { textContent } = req.body;
      // const textContent = req.body.textContent => 구조분해할당 해제
      // const textContent = 성공
      const { postId } = req.params;
      const { userId } = res.locals.user;

      const user = await User.findByPk(userId);
      const userNick = user.nickname;
      const avatarUrl = user.avatarUrl;

      const date = new Date();
      const comment = await Comment.create({
        userId,
        postId,
        date,
        textContent,
      });
      return res.status(201).send({
        userNick,
        comment,
        avatarUrl,
        message: "댓글 작성에 성공했습니다.",
      });
    } catch (err) {
      console.log(err);
      return res.status(500).send({
        message: "댓글 서버로부터 오류가 생겼습니다.",
      });
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
        // db에서 찾을 때 할당 받은 postId와 같은 조건인 것을 찾음 ( 해당 게시글의 댓글만 가져오면 되서)
        where: { postId },
        // 가져올때 속성은 comment의 전부 + commentLikeCnt(commentLikeId의 갯수)
        attributes: [
          "Comment.*",
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
        // raw => google링 해보면 나옴
        // 가공 하지 않은 상태가 됨 {} <- 이런걸로 안감싸고, 바로 model.keyname으로 나옴
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
      //   raw: true,
      //   order: [["date", "DESC"]],
      // });

      // 성공 응답 코드
      return res.status(200).send({
        respondComments,
        message: "댓글 조회에 성공했습니다.",
      });
    } catch (err) {
      console.log(err);
      return res.status(500).send({
        message: "댓글 조회로부터 문제가 생겼습니다.",
      });
    }
  },

  // 댓글 삭제
  commentDel: async (req, res) => {
    try {
      // postId와 commentId 변수에서 req.params에 있는 값을 불러와 할당한다(구조분해할당)
      const { postId, commentId } = req.params;
      // res.locals.user 는 미들웨어인 loginOnly에서 값을 가져와 userId에 할당한다
      const { userId } = res.locals.user;
      // Comment 테이블에서 데이터 하나만 가져온다.
      const reqDelete = await Comment.findOne({
        // 어디에서 postId 라는 컬럼에서 postId로, id 라는 컬럼에서 commentId로
        // where 옵션으로 나열함으로써, 기본적으로 and 옵션과 같다
        where: { postId, commentId },
      });
      console.log(userId);
      if (reqDelete.userId === userId) {
        // "특정 포스트 -> 특정 댓글" 지운다
        await reqDelete.destroy();
        return res.status(200).send({
          message: "댓글이 삭제되었습니다.",
        });
      } else {
        return res.status(400).send({
          message: "작성자가 아닙니다.",
        });
      }
    } catch (err) {
      return res.status(500).send({
        message: "댓글 삭제에 문제가 생겼습니다! 관리자에게 문의해주세요.",
      });
    }
  },
};

module.exports = { comments };
