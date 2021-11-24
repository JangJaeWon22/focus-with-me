const { Sequelize, sequelize, ChildComment, User } = require("../models");

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
      GROUP BY child.childCommentId
      LIMIT ${childPerPage}
      OFFSET ${offset}
      ; 
    `;
    const childComments = await sequelize.query(sqlQuery, {
      type: Sequelize.QueryTypes.SELECT,
    });

    return res.status(200).send({ message: "답글 조회 성공", childComments });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ message: "답글 조회 실패" });
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
    const result = await ChildComment.create(child);
    console.log(result);
    return res.status(201).send({ message: "답글 작성 완료", result });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ message: "답글을 작성할 수 없습니다." });
  }
};
const deleteChildComments = async (req, res) => {
  const { postId, commentId, childCommentId } = req.params;

  try {
    await ChildComment.destroy(childCommentId);
  } catch (error) {
    console.log(error);
    return res.status(500).send({ message: "답글 삭제 완료" });
  }
};

module.exports = { getChildComments, postChildComments, deleteChildComments };
