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
const getChildComments = async (req, res) => {};
const postChildComments = async (req, res) => {};
const deleteChildComments = async (req, res) => {};

module.exports = { getChildComments, postChildComments, deleteChildComments };
