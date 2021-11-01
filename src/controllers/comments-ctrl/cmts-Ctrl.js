const { Comment } = require("../../models");


const commentList = {
    //댓글 생성
    commentUser: async (req, res) => {
        try {
            const { textContent } = req.body;
            const { postId } = req.params;
            //const {userId} = res.locals.user;
            //console.log(userId);

            const userId = 5;
            const date = new Date();
            Comment.create ({
                userId, postId, date, textContent
            })
            res.status(201).send({
                message: "댓글에 성공했습니다."
            });
        } catch (err) {
            res.status(500).send({ message: "댓글 서버로부터 오류가 생겼습니다." });
        }
    },

    //댓글 조회
    commentSearch: async (req, res) => {
        try {
            const { postId } = req.params;
            const comment = await Comment.findAll({ where :  {postId} });
            res.status(201).send({
                comment, 
                message: "댓글 조회에 성공했습니다."
            });
        } catch (err) {
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
                where : { postId:postId, id:commentId } //어디에서 postId 라는 컬럼에서 postId로, commentId 라는 컬럼에서 commentId로
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