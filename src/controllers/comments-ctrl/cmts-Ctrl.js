const { Comment } = require("../../models");
//const { Op } = require("sequelize");


const commentList = {
    //댓글 생성
    commentUser: async (req, res) => {
        try {
            const {textContent} = req.body;
            const {postId} = req.params;
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
            res.status(500).send({ message: "댓글 서버에 오류가 생겼습니다."});
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
            res.status(500).send({ message: "댓글 조회에 실패했습니다."});
        }
    }
}


module.exports = {commentList};