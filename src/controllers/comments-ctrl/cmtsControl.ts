import { Request, Response } from "express";
import {Comment, User, CommentLike, ChildComment } from "../../models"
import Sequelize from "sequelize"
import { logger } from "../../config/logger";
import { likepost } from "../../interfaces/likepost"
import { Cmt } from "../../interfaces/comment"


class CommentController {
  // 댓글 생성을 비동기식 방식으로 처리한다
  public commentCreate =  async (req:Request, res:Response) => {
    const { postId } = req.params;
    try {
      const { textContent } : {textContent: string} = req.body;
      const userId : number = res.locals.user.userId;
      
      // user 변수에서 findByPk 를 통해 식별된 값을 가져온다
      const user = await User.findByPk(userId);
      // userNick 변수에서 사용자의 nickname을 선언한다
      const userNick = user.nickname;
      // avatarUrl 변수에서 사용자의 avatarUrl을 :선언한다
      const avatarUrl = user.avatarUrl;
      // 날짜를 선언한다
      const date = new Date();

      // comment model에서 생성해주기 위해 create를 사용한다
      // comment 라는 변수에 저장하고자 하는 값을 넣어준다
      const comment = await Comment.create({
        userId,
        postId: Number(postId),
        date,
        textContent,
      });

      //특정 게시물의 댓글의 수
      const cmtCount: number = await Comment.count({
        where: { postId:Number(postId) },
      });
    
      //페이지네이션 1페이지당 몇개를 보여줄지?
      const perPage: number = 4;

      //전체 페이지 수
      const totalPg = Math.ceil(cmtCount / perPage);

      const message: string = "댓글 작성에 성공했습니다.";
      logger.info(`POST api/posts/${postId}/comments 201 res:${message}`);
      // 성공 했을 경우, 다음과 같은 값을 보내준다
      return res.status(201).send({
        userNick,
        comment,
        avatarUrl,
        message,
        totalPg,
      });
    } catch (error) {
      // 에러 발생 했을 경우, console.log를 찍어준다
      console.log(error);
      const message: string = "알 수 없는 문제가 발생했습니다.";
      logger.error(`POST api/posts/${postId}/comments 500 res:${error}`);
      // try 구문에 에러가 생겼을 경우, 서버 에러로 인식하고 오류창을 보여준다
      return res.status(500).send({ message });
    }
  }

  /* 
    댓글 조회
    각 댓글별로 답글이 몇개있는지 끼워넣어서 보내줘야 함
  */
  public commentSearch = async (req:Request, res:Response) => {
    // req.params로 postId를 할당 받음
    const { postId } = req.params;
    try {
      // const postId = req.params.postId; // ES5 및 이전 문법

      // comment db에서 값을 찾아보자
      const commentAll : Cmt[]= await Comment.findAll({
        // db에서 찾을 때 할당 받은 postId와 같은 조건인 것을 찾음 (해당 게시글의 댓글만 가져오면 되서)
        where: { postId : Number(postId)},
        // 가져올때 속성은 comment의 전부 + commentLikeCnt(commentLikeId의 갯수)
        attributes: [
          "Comment.*",
          "User.avatarUrl",
          "User.nickname",
          [Sequelize.literal("COUNT(DISTINCT CommentLikes.commentLikeId)"), "commentLikeCnt"],
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
      const respondComments : any = [];
      /*
        반복문의 역할: commentAll 이 인덱스 오름차순으로 정렬되는데, 날짜 오름차순과 일치한다
                    프론트 쪽에서 날짜 최신순으로 보여줘야 해서, 배열의 unshift 메서드로 처리한다
                    또한, 현재 로그인한 유저가 각각의 댓글에 대해 좋아요를 눌렀는지 판별한 뒤, 판별한 값을 댓글 객체에 같이 넣어준다
      */
      for (const comment of commentAll) {
        let isCommentLiked = false;
        let childCnt: any = 0;
        // 사용자 인증 미들웨어를 타고 들어왔는데 사용자가 로그인 상태라면
        if (res.locals.user) {
          // 로그인 한 사용자가 현재의 포스트에서 좋아요를 했는지 db 검색
          const liked : likepost = await CommentLike.findOne({
            where: { userId: Number(res.locals.user.userId), postId: Number(comment.postId) },
          });
          if (liked) isCommentLiked = true;
        }

        childCnt = await ChildComment.count({
          where: {
            commentId: Number(comment.commentId),
          },
        });
        // 각 댓글별로 답글 수 찾기

        respondComments.unshift({
          userId: comment.userId,
          userNickname: comment.nickname,
          textContent: comment.textContent,
          avatarUrl: comment.avatarUrl,
          date: comment.date,
          commentId: comment.commentId,
          postId: comment.postId,
          commentLikeCnt: comment.commentLikeCnt,
          isCommentLiked,
          childCnt,
        });
      }

      // 댓글 페이지네이션
      let {pagination} = req.query;
      let page = Number(pagination)
      const perPage: number = 4; // limit

      // pagination 예외처리
      if (!pagination) page = 1;
      page = Number(page);
      const pageNum = page // 페이지 수를 10진수로 처리함
      const totCmtCount: number = respondComments.length; // 댓글 총 페이지 수와 댓글 총 수 구할때 필요함, 배열의 길이
      const totalPg = Math.ceil(totCmtCount / perPage); // 총 페이지를 보여주면, 댓글 여러개 달렸을때, 나눠서 보여주려고 사용함
      let startNum =(pageNum - 1) * perPage;
      let lastNum = pageNum * perPage;

      // 예외처리
      if (pageNum < 1) {
        const message: string = "댓글 리스트를 불러오는데 실패 했습니다.";
        logger.info(`GET /api/posts/${postId}/comments 400 res:${message}`);
        return res.status(400).send({ message });
      }

      if (totCmtCount < lastNum) {
        lastNum = totCmtCount;
      }

      const cmtsList : any = [];
      for (let i = startNum; i < lastNum; i++) {
        cmtsList.push(respondComments[i]);
      }
      
      const message:string = "댓글 조회에 성공했습니다.";
      logger.info(`GET /api/posts/${postId}/comments 200 res:${message}`);
      return res.status(200).send({ cmtsList, message, totalPg, totCmtCount });
    } catch (error) {
      console.log(error);
      const message:string = "알 수 없는 문제가 발생했습니다.";
      logger.error(`GET /api/posts/${postId}/comments 500 res:${error}`);
      return res.status(500).send({ message });
     
    }
  }

  // 댓글 삭제
  public commentDel = async (req:Request, res:Response) => {
    // postId와 commentId 변수에서 req.params에 있는 값을 불러와 할당한다(구조분해할당)
    const { postId, commentId } = req.params;
    try {
      // res.locals.user 는 미들웨어인 loginOnly에서 값을 가져와 userId에 할당한다
      const userId : number = res.locals.user.userId;
      // Comment 의 첫번째 요소만 보기 위해 데이터를 가져온다
      const reqDelete : Cmt = await Comment.findOne({
        // where 옵션으로 나열함으로써, 기본적으로 and 옵션과 같다
        // postId 라는 컬럼에서 postId로, commentId 라는 컬럼에서 commentId로 가져온다
        where: { postId:Number(postId), commentId:Number(commentId) },
      });

      // 삭제할 요청의 아이디가 해당 유저의 아이디가 같다면
      if (reqDelete.userId === userId) {
        // 특정 포스트에 해당하는 특정 댓글을 지운다
        // 특정 포스트 -> 특정 댓글
        await Comment.destroy({ 
          where: {postId:Number(postId), commentId:Number(commentId), userId}
        });
        // 댓글이 삭제되는 메세지를 제대로 보내졌을 경우
        const message:string = "댓글이 삭제되었습니다.";
        logger.info(
          `DELETE /api/posts/${postId}/comments/${commentId} 200 res:${message}`
        );
        return res.status(200).send({ message });
        // 삭제할 댓글이 해당 유저의 아이디가 일치하지 않을 경우
      } else {
        const message:string = "작성자가 아닙니다.";
        logger.info(
          `DELETE /api/posts/${postId}/comments/${commentId} 400 res:${message}`
        );
        return res.status(400).send({ message });
      }
    } catch (error) {
      console.log(error);
      // 댓글 기능이 제대로 작동하지 않을 경우
      const message:string = "알 수 없는 문제가 발생했습니다.";
      logger.error(
        `DELETE /api/posts/${postId}/comments/${commentId} 500 res:${error}`
      );
      return res.status(500).send({ message });
    }
  }
};

export default new CommentController();
