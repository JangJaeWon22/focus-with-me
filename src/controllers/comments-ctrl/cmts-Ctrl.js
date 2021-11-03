const { Comment } = require("../../models");
const { User } = require("../../models");

const commentList = {
    //댓글 생성
    commentUser: async (req, res) => {
        try {
            const { textContent } = req.body;
            const { postId } = req.params;
            //const {userId} = res.locals.user;
            //console.log(userId);

            const userId = 1;
            const date = new Date();
            Comment.create ({
                userId, postId, date, textContent
            })
            res.status(201).send({
                message: "댓글 작성에 성공했습니다."
            });
        } catch (err) {
            res.status(500).send({ message: "댓글 서버로부터 오류가 생겼습니다." });
        }
    },   

    //댓글 조회
    commentSearch: async (req, res) => {
        try {
            const { postId } = req.params;
            //console.log('postId : ' + postId)
            const commentAll = await Comment.findAll({ 
                include: [{model: User}], // 시퀄라이즈 사용법, include를 [{model : 조인할테이블}] 으로 구성해야 조인이 된다. 중요!!
                where :  {postId : postId} // where는 조건절, 결과값에서 postId 컬럼에 조건을 건다.
            }); //수정 //where&include 모두 사용
            //include 사용

            const respondComments = [] // 배열, 배열안에 객체(Object)를 저장
            for (const comment of commentAll) {
                respondComments.push({
                    userId : comment.userId,
                    userNickname : comment.User.nickname,
                    textContent : comment.textContent,
                    avatarUrl : comment.User.avatarUrl,
                    date : comment.date,
                    commentId : comment.commentId,
                    postId : comment.postId
                })
            }

            res.status(201).send({
                respondComments, 
                message: "댓글 조회에 성공했습니다."
            });
        } catch (err) {
            console.log(err);
            res.status(500).send({ message: "댓글 조회로부터 문제가 생겼습니다." });
        }
    },

    //댓글 삭제
    commentDel: async (req, res) => {
        try {
            const { postId } = req.params; //:postId 를 params로 저장, 구조분해할당
            const { commentId } = req.params; //:commentId 를 params로 저장, 구조분해할당            
            // equal to const { postId, commentId } = req.params;
            const reqDelete = await Comment.findOne({ //Comment 테이블에서 데이터 하나만 가져온다. 
                where : { postId:postId, id:commentId } //어디에서 postId 라는 컬럼에서 postId로, id 라는 컬럼에서 commentId로
                                                        //where 옵션으로 나열함으로써, 기본적으로 and 옵션과 같다
            }); 
            if(reqDelete) { //삭제요청이 들어오면
                await Comment.destroy({ where: {postId:postId, id:commentId} }) //"특정 포스트 -> 특정 댓글" 지운다
            }
            res.status(200).send({ message: "댓글이 삭제되었습니다." })
        } catch (err) {
            res.status(400).send({ message: "댓글 삭제에 문제가 생겼습니다! 관리자에게 문의해주세요." })
        }
    }
}


module.exports = {commentList};