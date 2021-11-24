const { Sequelize, sequelize, ChildComment, User } = require("../models");
const { logger } = require("../config/logger");

/* 
  댓글에 '답글 더보기' 버튼이 있고
  버튼 누르면 get api 호출
  페이지네이션 (무한스크롤) 5개씩?
  {
    childCommentId,
    textContent,
    postId,
    userId,
    avatarUrl (JOIN)
    nickname (JOIN)
  }

  Options:
    정렬 : 최신순(날짜 내림차순)
*/
const getChildComments = async (req, res) => {
  let { page } = req.query;
  const { commentId, postId } = req.params;
  if (!page) page = 1;
  //특정 댓글의 전체 답글 수
  const childPerPage = 3;
  const offset = (page - 1) * childPerPage;

  try {
    const totalCnt = await ChildComment.count({ where: { commentId } });
    const sqlQuery = `
      SELECT child.*, Users.nickname, Users.avatarUrl
      FROM ChildComments AS child
      JOIN Users ON child.userId = Users.userId
      WHERE child.commentId = ${commentId} and child.postId = ${postId}
      GROUP BY child.childCommentId
      LIMIT ${childPerPage}
      OFFSET ${offset}
      ; 
    `;
    const childComments = await sequelize.query(sqlQuery, {
      type: Sequelize.QueryTypes.SELECT,
    });

    message = "답글 조회 성공";
    logger.info(
      `GET /api/posts/${postId}/comments/${commentId}/childs 200 res: ${message}`
    );
    return res.status(200).send({ message, childComments, totalCnt });
  } catch (error) {
    console.log(error);
    message = "답글 조회 실패";
    logger.error(
      `GET /api/posts/${postId}/comments/${commentId}/childs 500 res: ${error}`
    );
    return res.status(500).send({ message });
  }
};

const postChildComments = async (req, res) => {
  const {
    body: { textContent },
    params: { postId, commentId },
  } = req;
  const { userId } = res.locals.user;
  const date = new Date();

  const child = {
    textContent,
    postId,
    userId,
    date,
    commentId,
  };
  try {
    await ChildComment.create(child);
    // 프론트에서 댓글 생성하면 바로 리턴되는 댓글을 컴포넌트로 붙여서 보여준다고 함
    // avatarUrl, nickname

    const sqlQuery = `SELECT child.*, Users.nickname, Users.avatarUrl
      FROM ChildComments AS child
      JOIN Users ON child.userId = Users.userId
      GROUP BY child.childCommentId
      ;`;
    const createdChild = await sequelize.query(sqlQuery, {
      type: Sequelize.QueryTypes.SELECT,
    });
    message = "답글 작성 완료";
    logger.info(
      `POST /api/posts/${postId}/comments/${commentId}/childs 200 res: ${message}`
    );
    return res.status(201).send({ message, createdChild /* result */ });
  } catch (error) {
    console.log(error);
    message = "답글을 작성 할 수 없습니다.";
    logger.error(
      `POST /api/posts/${postId}/comments/${commentId}/childs 500 res: ${error}`
    );
    return res.status(500).send({ message });
  }
};

const deleteChildComments = async (req, res) => {
  const { postId, commentId, childCommentId } = req.params;

  // 자기꺼만 삭제할 수 있어야 하고
  // 기타 등등.....
  try {
    const { userId } = res.locals.user;
    const childComment = await findByPk(childCommentId);
    console.log(childComment);

    // 답글 없을 경우 예외 처리
    if (!childComment) {
      message = "답글을 찾을 수 없습니다.";
      logger.info(
        `DELETE /api/posts/${postId}/comments/${commentId}/childs/${childCommentId} 400 res: ${message}`
      );
      return res.status(400).send({ message });
    }
    // 로그인한 유저가 작성자일 경우
    if (userId === childComment.userId) {
      await ChildComment.destroy(childCommentId);
      message = "답글 삭제 완료";
      logger.info(
        `DELETE /api/posts/${postId}/comments/${commentId}/childs/${childCommentId} 200 res: ${message}`
      );
      return res.status(200).send({ message });
    } else {
      // 로그인한 유저가 작성자가 아닐 경우
      message = "답글을 작성한 작성자가 아닙니다.";
      logger.info(
        `DELETE /api/posts/${postId}/comments/${commentId}/childs/${childCommentId} 400 res: ${message}`
      );
      return res.status(400).send({ message });
    }
  } catch (error) {
    console.log(error);
    message = "답글 삭제 실패";
    logger.error(
      `POST /api/posts/${postId}/comments/${childs}/childs/${childCommentId} 500 res: ${error}`
    );
    return res.status(500).send({ message });
  }
};

module.exports = { getChildComments, postChildComments, deleteChildComments };
